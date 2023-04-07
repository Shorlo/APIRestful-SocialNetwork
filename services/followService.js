const Follow = require('../models/Follow');

const followUserIds = async(identityUserId) =>
{
    try
    {
        // Get info about following and followers

        let following = await Follow.find({'user': identityUserId}).select({'followed': 1, '_id': 0}).exec();

        let followers = await Follow.find({'followed': identityUserId}).select({'user': 1, '_id': 0}).exec();

        // Get identities array
        let followingClean = [];
        following.forEach(follow =>
        {
            followingClean.push(follow.followed);
        });

        let followersClean = [];
        followers.forEach(follow =>
        {
            followersClean.push(follow.user);
        });


        return { following: followingClean, followers: followersClean };
    }
    catch(error)
    {
        return {};
    }
    
}

const  followThisUser = async (identityUserId, profileUserId) =>
{
    
}

module.exports = { followUserIds, followThisUser }