const Parser = require("rss-parser");
const parser = new Parser({ defaultRSS: 2.0 });

const FeedSchema = require("./model");

exports.saveFeed = async function({ body: { url } }, res, next) {
  try {
    const feed = await parser.parseURL(url);

    const feedSchema = new FeedSchema({ url: url });

    feedSchema.save(function(err, payload) {
      if (err) {
        return next(err);
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET");
      res.json(feed);
    });
  } catch (error) {
    res.status(500)
    return next(error);
  }
};

exports.getFeeds = function(req, res) {
  const skip = req.query.skip || 0;
  const limit = req.query.limit || 0;
  FeedSchema.find()
    .skip(Number(skip))
    .limit(Number(limit))
    .exec(function(err, payload) {
      if (err) return res.send(err);

      const feedRequests = payload.map(feed => {
        return parser.parseURL(feed.url);
      });

      Promise.all(feedRequests)
        .then(response => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET");
          // return only the first 6 items
          res.json(
            response.map(current => ({
              ...current,
              items: current.items.slice(0, 10)
            }))
          );
        })
        .catch(err => {
          console.error("Error", err);
        });
    });
};
