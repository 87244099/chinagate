
const Fai = require("../utils/util");
async function getCompanyAIndexPageData(companyId){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url: "/ajax/company/company?cmd=getCompanyAIndexPageData&id="+companyId,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    });
  })
}

module.exports = {
  getCompanyAIndexPageData
}