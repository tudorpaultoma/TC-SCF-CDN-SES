//'use strict';
const tencentcloud = require("tencentcloud-sdk-nodejs");
const SID = "add your Secret ID here"
const SKEY = "add your Secret KEY here"
const email_sender = "example@verified-domain.eu"
const email_recipient = "recipient@example.com"
const template_ID = 00000 //add the email template ID here
const CdnClient = tencentcloud.cdn.v20180606.Client;
const SesClient = tencentcloud.ses.v20201002.Client;

const cdnclientConfig = {
   credential: {
      secretId: SID,
      secretKey: SKEY,
    },
    region: "",
    profile: {
      httpProfile: {
        endpoint: "cdn.tencentcloudapi.com",
      },
    },
  };

const sesclientConfig = {
    credential: {
      secretId: SID,
      secretKey: SKEY,
    },
    region: "ap-singapore",
    profile: {
      httpProfile: {
        endpoint: "ses.tencentcloudapi.com",
      },
    },
  };
  
  

function sendNotice(invoice,budget,bmax,bcur,bleft) {
  
  const subject = "The budget left for invoice " + invoice + " is : " + budget + "%"
  const template_data = "{\"invoice\":" + "\"" + invoice + "\"," + "\"budget\":" + "\"" + budget + "\"," + "\"bmax\":" + "\"" + bmax + "\"," + "\"bcur\":" + "\"" + bcur + "\"," + "\"bleft\":" + "\"" + bleft + "\"" + "}"
  const client = new SesClient(sesclientConfig);
  const params = {
      "FromEmailAddress": email_sender,
      "Destination": [
          email_recipient
      ],
      "Template": {
          "TemplateID": template_ID, //the template ID in Tencent Cloud SES will contain the text + variables in the format of {{variable}}. E.g Dear {{name}}, 
          "TemplateData": template_data //the output must be JSON so watch out for the formatting above
      },
      "Subject": subject
  };
  client.SendEmail(params).then(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.error("error", err);
    }
  );

}
  
exports.main_handler = async (event, context, callback) => {
  
    try {
      
      let today = new Date();
      let date = ("0" + today.getDate()).slice(-2);       
      let month = ("0" + (today.getMonth() + 1)).slice(-2);
      let year = today.getFullYear();
      //let hours = today.getHours();
      //let minutes = today.getMinutes();
      //let seconds = today.getSeconds();
      var lastday = new Date(today.getFullYear(), today.getMonth() + 1, 0);     
      var lastdaymonth = lastday.getDate();
      var starttime = year + "-" + month + "-01 10:00:00"
      var endtime = year + "-" + month + "-" + lastdaymonth + " 10:00:00"

      const params = {
          "StartTime": starttime,
          "EndTime": endtime,
          "Interval": "day",
          "Area": "overseas",
          "Metric": "flux"
      };
        
      const client = new CdnClient(cdnclientConfig);
      let result = await new Promise((res, rej) => {
          client.DescribeBillingData(params).then((data) => {
            var i = 0
            var bill_current_B = 0
            var bill_max_G = 140000
            const data_arr = data.Data[0].BillingData[0].DetailData
            for (i=0;i<data_arr.length;i++) {
              const date_temp = data_arr[i].Time.split("-")
              const day = date_temp[2].split(" ")
              const cons = data_arr[i].Value
              bill_current_B = bill_current_B + cons
              bill_current_G = bill_current_B/1000000000
              //console.log("Total consumption for day " + day[0] + " is " + bill_current_G + " GB" + " and current monthly consumption is " + bill_current_G + " GB")
            }
            var bill_remaining_G = bill_max_G-bill_current_G
            var bill_percent = (bill_remaining_G/bill_max_G)*100
            var invoice_date = month + "-" + year
            var number = Math.trunc(bill_percent*100)/100
            if (bill_current_G<bill_max_G) {
              //console.log("We are within budget and " + bill_remaining_G + " GB remaining")
              //console.log("Bill level is :" + number + "%")
              sendNotice(invoice_date,number,bill_max_G,bill_current_G,bill_remaining_G)
            }
            else {
              //console.log("We are out of budget")
            }
           } )
            /*function(error, result) {
              if (error) {
                rej(error);
              } else {
                res(result);
              }
            }*/
        });
      }
    

 catch(err) {
  console.log(err);
 }
  return total;
};
