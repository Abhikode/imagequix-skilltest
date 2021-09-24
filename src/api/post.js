const router = require('express').Router()
const models = require('../../models')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const getApiResponse = require('../utility/apiResponse')
const validator = require('validator');
const { authUser} = require('../middleware/auth')

router.post('/', authUser, async (req, res) => {
    let data

    try {
        data = _.pick(req.body, ['title', 'content'])
        data.user_id = req.user_id //from auth

        //Intentional or for error message on title or content
        let missingData = _.isEmpty(data.title) ? getApiResponse(500, {error : 'title required'}) : _.isEmpty(data.content) ? getApiResponse(500, {error : 'content required'}) : ''

        if(!_.isEmpty(missingData)) return res.status(500).send(missingData)

        let postCreated = await models.Post.create(data)
        console.log("Post Creation Successfull")

        res.send(getApiResponse(200, postCreated))
    } catch (e) {
        console.log("Post Creation failed", e.message)
        err_log(req.method, req.url, e.message)
        res.status(500).send(getApiResponse(500,e.message));
    }
})


router.get('/', authUser, async (req, res) => {
    let posts

    try {
        posts = await models.Post.findAll({
            where: {user_id: req.user_id},
        })

        !_.isEmpty(posts) ? res.send(getApiResponse(200,posts)) : res.send(getApiResponse(200,'No Posts Created'))
    } catch(e) {
        err_log(req.method, req.url, e.message)
        res.status(500).send(getApiResponse(500,e.message));
    }
})

router.put('/:id', authUser, async (req, res) => {
    let data

    try {
        data = _.pick(req.body, ['title', 'content'])
        data.user_id = req.user_id //from auth

        //Intentional or for error message on title or content
        let missingData = _.isEmpty(data.title) ? getApiResponse(500, {error : 'title required'}) : _.isEmpty(data.content) ? getApiResponse(500, {error : 'content required'}) : ''

        if(!_.isEmpty(missingData)) return res.send(missingData)

        let postUpdated = await models.Post.update(data,{ where : { id : req.params.id, user_id: data.user_id}})
        !_.isEmpty(postUpdated) && postUpdated[0] === 1 ? res.send(getApiResponse(200, "Post Updated ")) : res.send(getApiResponse(400, {error: 'post id not found'}))

    } catch (e) {
        console.log("Post Update failed", e.message)
        err_log(req.method, req.url, e.message)
        res.status(500).send(getApiResponse(500,e.message));
    }
})

router.delete('/:id', authUser, async (req, res) => {
   try {
    let postDeleted = await models.Post.destroy({where : { id : req.params.id, user_id: req.user_id }});
    console.log("Post Deleted Successfully", postDeleted)
    postDeleted === 1 ? res.send(getApiResponse(200, "Post Deleted ")) : res.send(getApiResponse(400, {error: 'post id not found'}))
   } catch(e) {
        console.log(e)
        err_log(req.method, req.url, e.message)
        res.status(500).send(getApiResponse(500,e.message));
   }
})

module.exports = router