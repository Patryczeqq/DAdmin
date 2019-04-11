const fs = require("fs")


module.exports = {
    name: "Google Safe Image",
    init: (dclient) => {
        client = dclient

        fs.exists("./googleapi.json", exists => {
            if (exists)
                client.on('message', msg => {
                    if (msg.author.bot) return
                    if (msg.attachments.array().length = 0) return
                    var img = msg.attachments.first()
                    if (img == undefined) return
                    if (img.height == undefined) return
                    if (msg.channel.nsfw) return

                    detectSafeSearch(img.proxyURL, results => {
                        var score = 0;
                        if (results.safeSearchAnnotation.adult == "VERY_LIKELY" || results.safeSearchAnnotation.adult == "LIKELY") {
                            score = "adult"
                        }
                        if (results.safeSearchAnnotation.racy == "VERY_LIKELY" || results.safeSearchAnnotation.racy == "LIKELY") {
                            score = "racy"
                        }

                        if (score != 0) {
                            var stringmsg = `Adult: ${results.safeSearchAnnotation.adult} \n Medical: ${results.safeSearchAnnotation.medical}\n Spoof: ${results.safeSearchAnnotation.spoof}\n Violence: ${results.safeSearchAnnotation.violence}\n Racy: ${results.safeSearchAnnotation.racy}`;
                            stringmsg += "\n\n Tags: "
                            for (var i = 0; i < results.labelAnnotations.length; i++) {
                                stringmsg += results.labelAnnotations[i].description
                                if (i + 1 < results.labelAnnotations.length)
                                    stringmsg += ", "
                            }
                            // msg.reply(stringmsg)
                            msg.reply("Oi, you can't have that " + score + " " + results.labelAnnotations[0].description.toLowerCase() + " here 😢")
                        }
                    })
                })
            else {
                console.error("Google Safe Image ERROR\n" + __dirname + "/googleapi.json didn't exist\nYou need to create a service account key\nhttps://cloud.google.com/iam/docs/creating-managing-service-account-keys/ ")
            }

        })
    }
}

async function detectSafeSearch(fileName, cb) {
    // [START vision_safe_search_detection]
    const vision = require('@google-cloud/vision');

    // Creates a client
    var pid = JSON.parse(fs.readFileSync("./googleapi.json")).project_id
    const client = new vision.ImageAnnotatorClient({
        projectId: pid,
        keyFilename: './googleapi.json'
    });

    console.log(client.features)
    const request = {

        "image": {
            "source": {
                "imageUri": fileName
            }
        },

        features: [
            {
                type: "LABEL_DETECTION",
            },
            {
                type: "SAFE_SEARCH_DETECTION",
            }
        ]
    }



    const [result] = await client.annotateImage(request);
    console.log(result);
    cb(result);
}
