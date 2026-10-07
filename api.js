const config=require("../../config"),{reply}=require("./_helpers");
const LAB=new Set(["get","post","put","delete","patch","head","options","headers","status"]);
exports.run=async c=>{if(c.args?.[0]&&LAB.has(String(c.args[0]).toLowerCase()))return require("./apilab").run(c);return reply(c,`🌐 API\n${config.api.url}\nMethod: ${config.api.method}`)};
