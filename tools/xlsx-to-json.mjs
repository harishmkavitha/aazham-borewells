import * as XLSX from 'xlsx';
import fs from 'fs';
const input=process.argv[2]||'config/site-config.xlsx', output=process.argv[3]||'config/site-config.json';
const wb=XLSX.readFile(input);
const rows=n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{defval:''});
const customers={};
for(const r of rows('Customers')){const id=String(r.ClientID).trim();if(!id)continue;customers[id]={business:{name:r.BusinessName,phoneDisplay:r.PhoneDisplay,phoneDigits:String(r.PhoneDigits),whatsappDigits:String(r.WhatsAppDigits||r.PhoneDigits),email:r.Email,address:r.Address,googleMapEmbed:r.GoogleMapEmbed,googleMapLink:r.GoogleMapLink,summary:r.BusinessSummary,logoPath:r.LogoPath||'assets/img/logo.svg',faviconPath:r.FaviconPath||'assets/img/favicon.svg'},theme:{},typography:{},links:{facebook:r.Facebook,linkedin:r.LinkedIn,instagram:r.Instagram,pinterest:r.Pinterest,twitter:r.Twitter,indiamart:r.IndiaMart,justdial:r.Justdial},pages:{},sections:{},content:{},media:{},_default:String(r.IsDefault).toLowerCase()==='true'||String(r.IsDefault)==='1'};}
for(const r of rows('Theme'))if(customers[r.ClientID])for(const [k,v] of Object.entries(r))if(k!=='ClientID'&&v!=='')customers[r.ClientID].theme[k]=String(v);
for(const r of rows('Typography'))if(customers[r.ClientID])for(const [k,v] of Object.entries(r))if(k!=='ClientID'&&v!=='')customers[r.ClientID].typography[k]=String(v);
for(const r of rows('Pages'))if(customers[r.ClientID]&&r.File){customers[r.ClientID].pages[r.File]={label:r.Label||r.File,enabled:String(r.Enabled).toLowerCase()!=='false'&&String(r.Enabled)!=='0',menuVisible:String(r.MenuVisible).toLowerCase()!=='false'&&String(r.MenuVisible)!=='0',contentVisible:String(r.ContentVisible).toLowerCase()!=='false'&&String(r.ContentVisible)!=='0'};}
for(const r of rows('Sections'))if(customers[r.ClientID]&&r.SectionID)customers[r.ClientID].sections[r.SectionID]={enabled:String(r.Enabled).toLowerCase()!=='false'&&String(r.Enabled)!=='0'};
for(const r of rows('Content'))if(customers[r.ClientID]&&r.Key)customers[r.ClientID].content[r.Key]={type:r.Type||'text',value:r.Value};
for(const r of rows('Media'))if(customers[r.ClientID]&&r.Key)customers[r.ClientID].media[r.Key]={type:r.Type||'image',value:r.Value};
const defaultClient=Object.keys(customers).find(k=>customers[k]._default)||Object.keys(customers)[0];Object.values(customers).forEach(c=>delete c._default);fs.writeFileSync(output,JSON.stringify({version:1,defaultClient,customers},null,2));console.log(`Generated ${output} for ${Object.keys(customers).length} clients`);
