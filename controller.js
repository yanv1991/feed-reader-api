const Parser = require("rss-parser");
const parser = new Parser();

const FeedSchema = require("./model");

exports.saveFeed = function(req, res) {
  const feed = new FeedSchema({ url: req.body.url });

  feed.save(function(err, payload) {
    if (err) {
      throw err;
    }

    return parser.parseURL(payload.url).then(response => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET");
      res.json(response);
    });
  });
};

exports.getFeeds = function(req, res) {
  FeedSchema.find(function(err, payload) {
    if (err) return res.send(err);

    const feedRequests = payload.map(feed => {
      return parser.parseURL(feed.url);
    });

    Promise.all(feedRequests)
      .then(response => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET");
        res.json(response);
      })
      .catch(err => {
        console.error("Error", err);
      });
  });
};
