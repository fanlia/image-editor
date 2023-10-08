(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();document.querySelector("#app").innerHTML=`
  <div>
    <h1>图片编辑器</h1>
    <div class="card">
    <h3>水印</h3>
    <p>
    <label>
    <span>文字:</span>
    <input type="text" name="watermark_text" id="watermark_text" value="watermark"/>
    <label>
    </p>
    <p>
    <label>
    <span>字体:</span>
    <select name="watermark_font_family" id="watermark_font_family">
      <option value='serif'>serif</option>
      <option value='sans-serif'>sans-serif</option>
      <option value='monospace'>monospace</option>
    </select>
    <input type="range" name="watermark_font_size" id="watermark_font_size" value="50"/>
    <label>
    </p>
    <p>
    <p>
    <label>
    <span>颜色:</span>
    <input type="color" name="watermark_color" id="watermark_color" value="#FFFFFF"/>
    <label>
    </p>
    <p>
    <label>
    <span>空心:</span>
    <input type="checkbox" name="watermark_stroke" id="watermark_stroke"/>
    <label>
    </p>
    <p>
    <label>
    <span>透明:</span>
    <input type="range" name="watermark_opacity" id="watermark_opacity" value="20"/>
    <label>
    </p>
    <p>
    <label>
    <span>密度:</span>
    <input type="range" name="watermark_count" id="watermark_count" value="50"/>
    <label>
    </p>
    <p>
    <span>模板:</span>
    <button name="load_watermark_options" id="load_watermark_options">加载</button>
    <button name="store_watermark_options" id="store_watermark_options">保存</button>
    </p>
    </div>
    <hr />
    <h3>图片预览</h3>
    <p>
    <label>
    <span>选择图片:</span>
    <input type="file" name="source_images" id="source_images" multiple accept="image/*" />
    <label>
    </p>
    <p>点击图片即可下载</p>
    <div id="preview_images">请先选择图片</div>
  </div>
`;const v=document.querySelector("#watermark_text"),b=document.querySelector("#watermark_font_family"),x=document.querySelector("#watermark_font_size"),S=document.querySelector("#watermark_color"),L=document.querySelector("#watermark_opacity"),q=document.querySelector("#watermark_stroke"),T=document.querySelector("#watermark_count"),U=document.querySelector("#source_images"),F=document.querySelector("#preview_images"),j=document.querySelector("#load_watermark_options"),z=document.querySelector("#store_watermark_options"),E=n=>new Promise((o,r)=>{const a=new FileReader;a.onload=e=>{const t=new Image;t.title=n.name,t.src=e.target.result,o(t)},a.onerror=e=>{r(e)},a.readAsDataURL(n)});class A{constructor(o){this.image=o,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d")}updateImage(){return this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.width=this.image.width,this.canvas.height=this.image.height,this.ctx.drawImage(this.image,0,0),this}drawLine(o,r,a,e){const t=this.ctx;t.beginPath(),t.moveTo(o.x+a,o.y),t.lineTo(r.x+a,r.y),t.stroke()}updateText({text:o,font_size:r,font_family:a,color:e,stroke:t,opacity:s,count:f=4}){this.updateImage();const c=this.ctx;c.globalAlpha=s/100,c.font=`${r}px ${a}`,c.strokeStyle=e,c.fillStyle=e,c.lineWidth=4,c.textBaseline="middle";const{width:R}=c.measureText(o),y=f,g=f,M=Math.round(this.canvas.width/g),P=Math.round(this.canvas.height/y);let d=[];for(let i=0;i<y;i++){let _=[];for(let u=0;u<g;u++){const p=i*M,l=u*P+r;_.push({x:p,y:l,i,j:u})}d.push(_)}for(const i of d.flat()){const{x:_,y:u,i:p,j:l}=i;if(!((p+l)%2===0)||(t?c.strokeText(o,_,u):c.fillText(o,_,u),p===y-1))continue;const h=R/2,k=r/2;if(l===0){const w=d[p+1][l+1];this.drawLine(i,w,h,k)}else if(l===g-1){const w=d[p+1][l-1];this.drawLine(w,i,h,k)}else{const w=d[p+1][l+1];this.drawLine(i,w,h,k);const N=d[p+1][l-1];this.drawLine(N,i,h,k)}}return this}}let I=[];const O=()=>{const n=v.value,o=+x.value,r=b.value,a=S.value,e=q.checked,t=+L.value,s=Math.round(+T.value/10);return{text:n,font_size:o,font_family:r,color:a,stroke:e,opacity:t,count:s}},m=async()=>{const n=O();console.log(n);for(const o of I)o.updateText(n)},B=(n,o)=>{n.toBlob(r=>{const a=document.createElement("a"),e=URL.createObjectURL(r);a.href=e,a.download=o.name,a.click(),setTimeout(()=>URL.revokeObjectURL(e),0)},o.type)},H=async n=>{const o=O();F.innerHTML="";for(const r of n){const a=await E(r),e=new A(a);e.updateText(o);const t=e.canvas;t.onclick=s=>{B(t,r)},F.append(t),I.push(e)}};v.oninput=m;x.oninput=m;b.oninput=m;S.oninput=m;q.onchange=m;L.oninput=m;T.oninput=m;U.onchange=async n=>{const o=n.target.files;H(o)};j.onclick=()=>{const n=localStorage.getItem("watermark_options");if(n)try{const{text:o,font_size:r,font_family:a,color:e,stroke:t,opacity:s,count:f}=JSON.parse(n);v.value=o,x.value=r,b.value=a,S.value=e,q.checked=t,L.value=s,T.value=f}catch{}};z.onclick=()=>{const n=O();localStorage.setItem("watermark_options",JSON.stringify(n)),alert("保存成功")};
