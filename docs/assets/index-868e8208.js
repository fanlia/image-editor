(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();document.querySelector("#app").innerHTML=`
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
    <input type="range" name="watermark_count" id="watermark_count" value="5" min="0" max="10"/>
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
`;const v=document.querySelector("#watermark_text"),b=document.querySelector("#watermark_font_family"),x=document.querySelector("#watermark_font_size"),S=document.querySelector("#watermark_color"),L=document.querySelector("#watermark_opacity"),q=document.querySelector("#watermark_stroke"),T=document.querySelector("#watermark_count"),U=document.querySelector("#source_images"),F=document.querySelector("#preview_images"),j=document.querySelector("#load_watermark_options"),z=document.querySelector("#store_watermark_options"),E=n=>new Promise((a,r)=>{const o=new FileReader;o.onload=e=>{const t=new Image;t.title=n.name,t.src=e.target.result,a(t)},o.onerror=e=>{r(e)},o.readAsDataURL(n)});class A{constructor(a){this.image=a,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d")}updateImage(){return this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.width=this.image.width,this.canvas.height=this.image.height,this.ctx.drawImage(this.image,0,0),this}drawLine(a,r,o,e){const t=this.ctx;t.beginPath(),t.moveTo(a.x+o,a.y),t.lineTo(r.x+o,r.y),t.stroke()}updateText({text:a,font_size:r,font_family:o,color:e,stroke:t,opacity:s,count:f}){this.updateImage();const c=this.ctx;c.globalAlpha=s/100,c.font=`${r}px ${o}`,c.strokeStyle=e,c.fillStyle=e,c.lineWidth=4,c.textBaseline="middle";const{width:R}=c.measureText(a),y=f,g=f,P=Math.round(this.canvas.width/g),M=Math.round(this.canvas.height/y);let d=[];for(let i=0;i<y;i++){let _=[];for(let u=0;u<g;u++){const m=i*P,l=u*M+r;_.push({x:m,y:l,i,j:u})}d.push(_)}for(const i of d.flat()){const{x:_,y:u,i:m,j:l}=i;if(!((m+l)%2===0)||(t?c.strokeText(a,_,u):c.fillText(a,_,u),m===y-1))continue;const h=R/2,k=r/2;if(l===0){const w=d[m+1][l+1];this.drawLine(i,w,h,k)}else if(l===g-1){const w=d[m+1][l-1];this.drawLine(w,i,h,k)}else{const w=d[m+1][l+1];this.drawLine(i,w,h,k);const N=d[m+1][l-1];this.drawLine(N,i,h,k)}}return this}}let I=[];const O=()=>{const n=v.value,a=+x.value,r=b.value,o=S.value,e=q.checked,t=+L.value,s=+T.value;return{text:n,font_size:a,font_family:r,color:o,stroke:e,opacity:t,count:s}},p=async()=>{const n=O();console.log(n);for(const a of I)a.updateText(n)},B=(n,a)=>{n.toBlob(r=>{const o=document.createElement("a"),e=URL.createObjectURL(r);o.href=e,o.download=a.name,o.click(),setTimeout(()=>URL.revokeObjectURL(e),0)},a.type)},H=async n=>{const a=O();F.innerHTML="";for(const r of n){const o=await E(r),e=new A(o);e.updateText(a);const t=e.canvas;t.onclick=s=>{B(t,r)},F.append(t),I.push(e)}};v.oninput=p;x.oninput=p;b.oninput=p;S.oninput=p;q.onchange=p;L.oninput=p;T.oninput=p;U.onchange=async n=>{const a=n.target.files;H(a)};j.onclick=()=>{const n=localStorage.getItem("watermark_options");if(n){try{const{text:a,font_size:r,font_family:o,color:e,stroke:t,opacity:s,count:f}=JSON.parse(n);v.value=a,x.value=r,b.value=o,S.value=e,q.checked=t,L.value=s,T.value=f}catch{}p()}};z.onclick=()=>{const n=O();localStorage.setItem("watermark_options",JSON.stringify(n)),alert("保存成功")};
