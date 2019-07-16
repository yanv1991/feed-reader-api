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
    }).catch((err) => console.error("Error", err))
  });
};

exports.getFeeds = function(req, res) {
    const skip = req.query.skip || 0
    const limit = req.query.limit || 0
  FeedSchema.find().skip(Number(skip)).limit(Number(limit)).exec(function(err, payload) {
    if (err) return res.send(err);

    const feedRequests = payload.map(feed => {
      return parser.parseURL(feed.url);
    });

    Promise.all(feedRequests)
      .then(response => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET");
        // return only the first 6 items
        res.json(response.map((current) => ({ ...current, items: current.items.slice(0, 10) })));
      })
      .catch(err => {
        console.error("Error", err);
      });
  });
};
