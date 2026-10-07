const { matchName, confidence, addClan, listClans } = require("../../clans");
const { getName } = require("../../db");
const { footer } = require("../../format");
module.exports={run:async({sock,m,from,args,isOwner,isSudo,senderNumber})=>{
  if(!isOwner&&!isSudo)return sock.sendMessage(from,{text:"⛔ Sudo only."},{quoted:m});
  const sub=(args[0]||"").toLowerCase();
  if(sub==="list"){
    const clans=listClans(),lines=[`✦ 𝗖𝗟𝗔𝗡 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘 — ${clans.length} entries`,""];
    clans.slice(0,50).forEach((c,i)=>lines.push(`${i+1}. ${c.name}\n   Tag: ${c.tag}`));
    if(clans.length>50)lines.push(`… +${clans.length-50} more`); lines.push(footer(senderNumber));
    return sock.sendMessage(from,{text:lines.join("\n")},{quoted:m});
  }
  if(sub==="add"&&isOwner){
    const payload=args.slice(1).join(" ").split("|").map(s=>s.trim());
    if(payload.length<2)return sock.sendMessage(from,{text:"Usage: .scan add <name> | <tag> | <description>"},{quoted:m});
    const [name,tag,description]=payload; addClan({name,tag,description,members:0,age:"unknown",threat:"UNKNOWN"});
    return sock.sendMessage(from,{text:`✅ Added clan: ${name} (${tag})${footer(senderNumber)}`},{quoted:m});
  }
  const ctx=m.message?.extendedTextMessage?.contextInfo; let target=null,label="Unknown";
  if(ctx?.participant){target=ctx.participant;label=getName(target)||"Unknown";}
  else if(args[0]){const num=args[0].replace(/\D/g,"");if(!num)return sock.sendMessage(from,{text:"❌ Invalid number."},{quoted:m});target=`${num}@s.whatsapp.net`;label=getName(target)||`+${num}`;}
  else return sock.sendMessage(from,{text:"Usage:\n.scan (reply)\n.scan <number>\n.scan list\n.scan add <name> | <tag> | <desc>"},{quoted:m});
  const matches=matchName(label),conf=confidence(matches);
  if(!matches.length)return sock.sendMessage(from,{text:["╭──〔 𝗦𝗛𝗔𝗗𝗢𝗪 𝗦𝗖𝗔𝗡 〕",`│ Target: ${label}`,"│ Result: ❌ NOT FOUND","│ No known clan tag matched this display name.","╰──────────────",footer(senderNumber)].join("\n")},{quoted:m});
  const c=matches[0]; await sock.sendMessage(from,{text:["╭──〔 𝗦𝗛𝗔𝗗𝗢𝗪 𝗦𝗖𝗔𝗡 〕",`│ Target      : ${label}`,`│ Clan name   : ${c.name}`,`│ Clan tag    : ${c.tag}`,`│ member count: ${c.members??"unknown"}`,`│ description : ${c.description||"—"}`,`│ Confidence  : ${conf}%`,`│ clan age    : ${c.age||"unknown"}`,`│ Threat      : ${c.threat||"UNKNOWN"}`,"╰──────────────",footer(senderNumber)].join("\n")},{quoted:m});
}};
