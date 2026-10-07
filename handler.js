const config=require("../config"),log=require("../logger");
const {isSudo,getMode,isBanned,isRemoved,isPremium,saveName}=require("../db");
const commands={};
for(const n of ["menu","bancheck","ping","getid","device","session","stats","api","uptime","sudo","delsudo","self","public","support","restart","checkaccess","buypremium","premium","ban","unban","remove","banned","antiban","antibug","wafind","agecheck","getwadetail","getgcdetail","tgfind","tgage","tgdetail","tggcdetail","mode","scan","monitor","watch","health","services","apilab"])commands[n]=require(`./commands/${n}`);
commands["get-id"]=commands.getid;
const OSINT=new Set(["wafind","agecheck","getwadetail","getgcdetail","tgfind","tgage","tgdetail","tggcdetail"]);
const PUBLIC_ONLY=new Set(["menu","ping","uptime","support","buypremium","checkaccess","health","services"]);
function attachHandlers(sock){sock.ev.on("messages.upsert",async({messages,type})=>{if(type!=="notify")return;const m=messages[0];if(!m?.message)return;const from=m.key.remoteJid,sender=m.key.participant||m.key.remoteJid,senderNumber=String(sender).split("@")[0].split(":")[0];if(m.pushName){try{saveName(sender,m.pushName)}catch{}}
try{await commands.antibug.scan(sock,m,from,sender)}catch(e){log.error("antibug scan:",e.message)}
const text=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||"";if(!text.startsWith(config.prefix))return;const[rawCmd,...args]=text.slice(config.prefix.length).trim().split(/\s+/),cmd=rawCmd.toLowerCase(),handler=commands[cmd];if(!handler)return;const isOwner=senderNumber===config.owner.number,sudoUser=isSudo(senderNumber),mode=getMode();if(isRemoved(senderNumber)&&!isOwner)return;if(isBanned(senderNumber)&&!isOwner)return;
if(mode==="dev"&&!isOwner)return;
if(mode==="stealth"&&!isOwner)return;
if(mode==="maintenance"&&!isOwner&&!(["health","menu","support","checkaccess","mode"].includes(cmd)))return;
if(mode==="self"&&!isOwner&&!sudoUser&&!PUBLIC_ONLY.has(cmd)&&cmd!=="mode")return;
if(OSINT.has(cmd)&&!isOwner&&!sudoUser&&!isPremium(senderNumber))return sock.sendMessage(from,{text:"🔒 *OSINT is Premium-only*\n\nPurchase premium: .buypremium"},{quoted:m});
const ctx={sock,m,from,sender,senderNumber,args,text,isOwner,isSudo:sudoUser};try{await handler.run(ctx)}catch(e){log.error(`/${cmd}:`,e.message);await sock.sendMessage(from,{text:`❌ ${e.message}`},{quoted:m})}})}
module.exports={attachHandlers};
