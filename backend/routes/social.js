const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const Story = require('../models/Story');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Share = require('../models/Share');
const SavedPost = require('../models/SavedPost');
const Notification = require('../models/Notification');
const Follower = require('../models/Follower');
const Following = require('../models/Following');
const Message = require('../models/Message');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_aurastitch_123';

// Protect middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Seed helper (only runs if collection is empty)
const seedMockDataIfEmpty = async () => {
  const users = await User.find({});
  if (users.length === 0) return;

  const adminOrFirstUser = users[0];
  const adminId = adminOrFirstUser._id;

  // 1. Seed Posts
  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    await Post.create([
      {
        user: adminId,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
        ],
        caption: 'Loving this handwoven Ikkat dress fabric! Stitched beautifully for the summer season. ✨ #handmade #traditional #ikkat #slowfashion',
        hashtags: ['handmade', 'traditional', 'ikkat', 'slowfashion'],
        location: 'Hyderabad, India',
        taggedProducts: ['Ikkat Cotton Fabric', 'Summer Kurti'],
        taggedTailor: 'Priya Sharma Stitching'
      },
      {
        user: adminId,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
        ],
        caption: 'A custom royal wedding lehenga design in crimson and gold. Fully customized with AI mannequin studio. 👑 #bridal #weddinglehenga #luxurydesign',
        hashtags: ['bridal', 'weddinglehenga', 'luxurydesign'],
        location: 'New Delhi, India',
        taggedProducts: ['Crimson Silk Lehenga'],
        taggedTailor: 'Imperial Boutique'
      }
    ]);
  }

  // 2. Seed Reels
  const reelCount = await Reel.countDocuments();
  if (reelCount === 0) {
    await Reel.create([
      {
        user: adminId,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-stitching-a-fabric-close-up-41551-large.mp4',
        caption: 'Stitching a heavy zardozi border on premium silk. The process takes patience but is so satisfying! 🧵✨ #satisfying #sewing #tailoring',
        musicInfo: 'Lo-Fi Chill Beats by AuraStitch',
        productTags: ['Crimson Silk Borders'],
        tailorTags: ['Priya Boutique']
      },
      {
        user: adminId,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-colorful-cotton-yarn-skein-41549-large.mp4',
        caption: 'Choosing the perfect hand-spun cotton yarn for our upcoming handloom collection. Pure, raw, and organic. 🌾 #handloom #cotton #textiles',
        musicInfo: 'Flute Melodies of India',
        productTags: ['Organic Cotton Yarn'],
        tailorTags: ['Kiran Handloom']
      }
    ]);
  }

  // 3. Seed Stories
  const storyCount = await Story.countDocuments();
  if (storyCount === 0) {
    await Story.create([
      {
        user: adminId,
        mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        mediaType: 'image'
      }
    ]);
  }
};

// Seeding trigger inside GET endpoints
router.use(async (req, res, next) => {
  try {
    await seedMockDataIfEmpty();
  } catch (err) {
    console.error('Seeding error', err);
  }
  next();
});

// ==========================================
// 1. POSTS ENDPOINTS
// ==========================================

// GET /posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts
router.post('/posts', protect, async (req, res) => {
  try {
    const { images, caption, hashtags, location, taggedProducts, taggedTailor } = req.body;
    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    const post = await Post.create({
      user: req.user._id,
      images,
      caption,
      hashtags: hashtags || [],
      location: location || '',
      taggedProducts: taggedProducts || [],
      taggedTailor: taggedTailor || ''
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts/:id/like
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const existingLike = await Like.findOne({ user: req.user._id, targetId: postId, targetType: 'Post' });
    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
      return res.json({ liked: false, likesCount: post.likesCount });
    } else {
      // Like
      await Like.create({
        user: req.user._id,
        targetId: postId,
        targetType: 'Post'
      });
      post.likesCount += 1;
      await post.save();

      // Create Notification
      if (post.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: 'like',
          text: `${req.user.name} liked your post.`,
          targetId: postId,
          targetType: 'Post'
        });
      }

      return res.json({ liked: true, likesCount: post.likesCount });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /posts/:id/likes/status
router.get('/posts/:id/likes/status', protect, async (req, res) => {
  try {
    const existingLike = await Like.findOne({ user: req.user._id, targetId: req.params.id, targetType: 'Post' });
    res.json({ liked: !!existingLike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts/:id/comment
router.post('/posts/:id/comment', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await Comment.create({
      user: req.user._id,
      targetId: postId,
      targetType: 'Post',
      text
    });

    // Create Notification
    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        text: `${req.user.name} commented on your post: "${text.substring(0, 30)}..."`,
        targetId: postId,
        targetType: 'Post'
      });
    }

    const populated = await comment.populate('user', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /posts/:id/comments
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ targetId: req.params.id, targetType: 'Post' })
      .populate('user', 'name role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts/:id/save
router.post('/posts/:id/save', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const existingSave = await SavedPost.findOne({ user: req.user._id, post: postId });
    if (existingSave) {
      await existingSave.deleteOne();
      return res.json({ saved: false });
    } else {
      await SavedPost.create({ user: req.user._id, post: postId });
      return res.json({ saved: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /posts/:id/save/status
router.get('/posts/:id/save/status', protect, async (req, res) => {
  try {
    const existingSave = await SavedPost.findOne({ user: req.user._id, post: req.params.id });
    res.json({ saved: !!existingSave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts/:id/share
router.post('/posts/:id/share', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.sharesCount += 1;
      await post.save();
      await Share.create({ user: req.user._id, targetId: post._id, targetType: 'Post' });
    }
    res.json({ sharesCount: post ? post.sharesCount : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts/:id/report
router.post('/posts/:id/report', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.reportsCount += 1;
      await post.save();
    }
    res.json({ message: 'Post reported successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts/:id/view
router.post('/posts/:id/view', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.viewsCount += 1;
      await post.save();
    }
    res.json({ viewsCount: post ? post.viewsCount : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. REELS ENDPOINTS
// ==========================================

// GET /reels
router.get('/reels', async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'name role')
      .sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reels
router.post('/reels', protect, async (req, res) => {
  try {
    const { videoUrl, caption, musicInfo, productTags, tailorTags } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL is required.' });
    }

    const reel = await Reel.create({
      user: req.user._id,
      videoUrl,
      caption: caption || '',
      musicInfo: musicInfo || 'Original Audio',
      productTags: productTags || [],
      tailorTags: tailorTags || []
    });

    res.status(201).json(reel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reels/:id/like
router.post('/reels/:id/like', protect, async (req, res) => {
  try {
    const reelId = req.params.id;
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found.' });
    }

    const existingLike = await Like.findOne({ user: req.user._id, targetId: reelId, targetType: 'Reel' });
    if (existingLike) {
      await existingLike.deleteOne();
      reel.likesCount = Math.max(0, reel.likesCount - 1);
      await reel.save();
      return res.json({ liked: false, likesCount: reel.likesCount });
    } else {
      await Like.create({
        user: req.user._id,
        targetId: reelId,
        targetType: 'Reel'
      });
      reel.likesCount += 1;
      await reel.save();

      // Notification
      if (reel.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: reel.user,
          sender: req.user._id,
          type: 'like',
          text: `${req.user.name} liked your reel.`,
          targetId: reelId,
          targetType: 'Reel'
        });
      }

      return res.json({ liked: true, likesCount: reel.likesCount });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /reels/:id/likes/status
router.get('/reels/:id/likes/status', protect, async (req, res) => {
  try {
    const existingLike = await Like.findOne({ user: req.user._id, targetId: req.params.id, targetType: 'Reel' });
    res.json({ liked: !!existingLike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reels/:id/comment
router.post('/reels/:id/comment', protect, async (req, res) => {
  try {
    const reelId = req.params.id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found.' });
    }

    const comment = await Comment.create({
      user: req.user._id,
      targetId: reelId,
      targetType: 'Reel',
      text
    });

    if (reel.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: reel.user,
        sender: req.user._id,
        type: 'comment',
        text: `${req.user.name} commented on your reel: "${text.substring(0, 30)}..."`,
        targetId: reelId,
        targetType: 'Reel'
      });
    }

    const populated = await comment.populate('user', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /reels/:id/comments
router.get('/reels/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ targetId: req.params.id, targetType: 'Reel' })
      .populate('user', 'name role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reels/:id/share
router.post('/reels/:id/share', protect, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (reel) {
      reel.sharesCount += 1;
      await reel.save();
      await Share.create({ user: req.user._id, targetId: reel._id, targetType: 'Reel' });
    }
    res.json({ sharesCount: reel ? reel.sharesCount : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reels/:id/report
router.post('/reels/:id/report', protect, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (reel) {
      reel.reportsCount += 1;
      await reel.save();
    }
    res.json({ message: 'Reel reported.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reels/:id/view
router.post('/reels/:id/view', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (reel) {
      reel.viewsCount += 1;
      await reel.save();
    }
    res.json({ viewsCount: reel ? reel.viewsCount : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. STORIES ENDPOINTS
// ==========================================

// GET /stories
router.get('/stories', async (req, res) => {
  try {
    // Return stories created in last 24h
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stories = await Story.find({ createdAt: { $gte: cutoff } })
      .populate('user', 'name role')
      .sort({ createdAt: 1 });
    
    // Group by user
    const grouped = {};
    stories.forEach(s => {
      if (!s.user) return;
      const uid = s.user._id.toString();
      if (!grouped[uid]) {
        grouped[uid] = {
          user: s.user,
          stories: []
        };
      }
      grouped[uid].stories.push(s);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /stories
router.post('/stories', protect, async (req, res) => {
  try {
    const { mediaUrl, mediaType } = req.body;
    if (!mediaUrl) {
      return res.status(400).json({ message: 'Media URL is required.' });
    }

    const story = await Story.create({
      user: req.user._id,
      mediaUrl,
      mediaType: mediaType || 'image'
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 4. USERS AND FOLLOW ENDPOINTS
// ==========================================

// GET /suggested-users
router.get('/suggested-users', protect, async (req, res) => {
  try {
    // Find users of different roles
    const currentUserId = req.user._id;
    const users = await User.find({ _id: { $ne: currentUserId } }).limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /users/:id/follow
router.post('/users/:id/follow', protect, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself.' });
    }

    const existingFollow = await Follower.findOne({ user: targetUserId, follower: req.user._id });
    if (existingFollow) {
      // Unfollow
      await Follower.deleteOne({ user: targetUserId, follower: req.user._id });
      await Following.deleteOne({ user: req.user._id, following: targetUserId });
      return res.json({ following: false });
    } else {
      // Follow
      await Follower.create({ user: targetUserId, follower: req.user._id });
      await Following.create({ user: req.user._id, following: targetUserId });

      // Create Notification
      await Notification.create({
        recipient: targetUserId,
        sender: req.user._id,
        type: 'follow',
        text: `${req.user.name} started following you.`,
        targetId: req.user._id,
        targetType: 'User'
      });

      return res.json({ following: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /users/:id/follow/status
router.get('/users/:id/follow/status', protect, async (req, res) => {
  try {
    const existingFollow = await Follower.findOne({ user: req.params.id, follower: req.user._id });
    res.json({ following: !!existingFollow });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 5. MESSAGES ENDPOINTS
// ==========================================

// GET /conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }]
    }).sort({ createdAt: -1 });

    const conversationMap = {};
    messages.forEach(msg => {
      const partnerId = msg.sender.toString() === currentUserId.toString()
        ? msg.recipient.toString()
        : msg.sender.toString();

      if (!conversationMap[partnerId]) {
        conversationMap[partnerId] = msg;
      }
    });

    const conversationList = [];
    for (let partnerId of Object.keys(conversationMap)) {
      const partner = await User.findById(partnerId).select('name role email');
      if (partner) {
        conversationList.push({
          partner,
          lastMessage: conversationMap[partnerId]
        });
      }
    }

    res.json(conversationList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /messages/:recipientId
router.get('/messages/:recipientId', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const recipientId = req.params.recipientId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: recipientId },
        { sender: recipientId, recipient: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages from recipient to sender as read
    await Message.updateMany(
      { sender: recipientId, recipient: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /messages
router.post('/messages', protect, async (req, res) => {
  try {
    const { recipientId, text, imageUrl } = req.body;
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required.' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text: text || '',
      imageUrl: imageUrl || ''
    });

    // Create Notification
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'message',
      text: `${req.user.name} sent you a message: "${text ? text.substring(0, 30) : 'Image'}"`,
      targetId: message._id,
      targetType: 'User'
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 6. NOTIFICATIONS ENDPOINTS
// ==========================================

// GET /notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /notifications/:id/read
router.post('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 7. PROFILE ENDPOINTS
// ==========================================

// GET /profile/:userId
router.get('/profile/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    const reels = await Reel.find({ user: userId }).sort({ createdAt: -1 });
    const saved = await SavedPost.find({ user: userId }).populate('post').sort({ createdAt: -1 });

    const followersCount = await Follower.countDocuments({ user: userId });
    const followingCount = await Following.countDocuments({ user: userId });

    res.json({
      user,
      posts,
      reels,
      saved,
      followersCount,
      followingCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 8. DISCOVER / CATEGORIES ENDPOINTS
// ==========================================

// GET /discover
router.get('/discover', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.caption = new RegExp(category, 'i');
    }
    if (search) {
      query.$or = [
        { caption: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { hashtags: new RegExp(search, 'i') }
      ];
    }

    const posts = await Post.find(query).populate('user', 'name role').limit(30);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
