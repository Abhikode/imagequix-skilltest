const router = require('express').Router()
const models = require('../../models')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const { authUser} = require('../middleware/auth')
const validator = require('validator');
const sequelize = models.sequelize;

router.post('/:post_id', authUser, async (req, res) => {
    const data = _.pick(req.body, ['content'])
    data.user_id = req.user_id //from auth
    data.post_id = req.params.post_id
    if(validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    if(data.post_id===null) return res.status(500).send({error : 'post id required'})
    
    return await models.Comment.create(
        data
    ).then((rslt) => {
        if(rslt) return res.status(201).send()
        throw new Error('Comment not created')
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send({error : e.message})
    })
})

/*
* POST Threaded comments - uses transaction for record integrity
*/
router.post('/:post_id/reply/:root_comment_id', authUser, async (req, res) => {
    const data = _.pick(req.body, ['content'])
    data.user_id = req.user_id // from auth
    data.post_id = req.params.post_id
    data.root_comment_id = req.params.root_comment_id
    if(validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    if(data.post_id===null) return res.status(500).send({error : 'post id required'})
    if(data.root_comment_id===null) return res.status(500).send({error : 'root thread comment id required'})
    
    return sequelize.transaction(async (t) => {
        return await models.Comment.create(
            data,
            { transaction : t}
        ).then( async (rslt) => {
            if(rslt) {
                let inner_data = {
                    root_comment_id : data.root_comment_id,
                    child_comment_id: rslt.id
                }
                return await models.CommentThread.create(
                    inner_data,
                    { transaction : t}
                ).then((inner_rslt) => {
                   if(inner_rslt) return {status : 201}
                   throw new Error('Thread comment not created')
                }).catch((e) => {
                    throw new Error('Error while creating thread comment')
                })
            } 
            throw new Error('Root comment not created')
        }).catch((e) => {
            console.log('transacion errror ', e)
            throw new Error('Error while creating root comment')
        })
    }).then((result) => {
        if(result) return res.status(result.status).send()
    }).catch((e)=>{
        err_log(req.method, req.url, e.message)
        res.status(500).send({error: e.message})
    });

})

router.get('/:post_id/reply/:root_comment_id', authUser, (req, res) => {
    models.Comment.findAll({
        where : { post_id: req.params.post_id},
        include: [
            {
                model: models.CommentThread,
                where : {root_comment_id : req.params.root_comment_id },
                attributes:['child_comment_id', 'root_comment_id']
            }
        ],
        order: [
            ['createdAt', 'ASC']
        ],
        raw: true,
        nest: true
    }).then((rslt) => {
        if(rslt) return res.status(200).send(rslt)
    }).catch((e) => {
        console.log(e)
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.get('/:post_id', authUser, async (req, res) => {
    models.Comment.findAll({
        where : { post_id: req.params.post_id},
        include: [
            {
                model: models.Post,
                required: true
            }
        ],
        order: [
            ['createdAt', 'DESC']
          ],
          raw: true,
          nest: true
    }).then((rslt) => {
        if(rslt) return res.status(200).send(rslt)
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.put('/:comment_id', authUser, (req, res) => {
    const data = _.pick(req.body, ['content'])
    if(validator.isEmpty(data.content, { ignore_whitespace: true })) return res.status(500).send({error : 'title required'})
    
    models.Comment.update(
         data,
        { where : { id : req.params.comment_id, user_id: req.user_id}}
    ).then((rslt) => {
        if(rslt && rslt[0] === 1) return res.status(200).send(rslt);
        return res.status(400).send();
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

router.delete('/:comment_id', authUser, (req, res) => {
    models.Comment.destroy(
        { where : { id : req.params.comment_id, user_id: req.user_id }}
    ).then((rslt) => {
        if(rslt && rslt === 1) return res.status(200).send();
        return res.status(400).send();
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

module.exports = router