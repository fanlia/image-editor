import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>图片编辑器</h1>
    <div class="card">
    <h3>水印</h3>
    <p>
    <label>
    <span>文字:</span>
    <input type="text" name="watermark_text" id="watermark_text" value="梧桐8686"/>
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
    <input type="color" name="watermark_color" id="watermark_color" value="#000000"/>
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
    <span>选择图片:</span>
    <input type="file" name="source_images" id="source_images" multiple accept="image/*" />
    <label>
    </p>
    </div>
    <hr />
    <h3>图片预览</h3>
    <div id="preview_images">请先选择图片</div>
  </div>
`

const watermark_text = document.querySelector('#watermark_text')
const watermark_font_family = document.querySelector('#watermark_font_family')
const watermark_font_size = document.querySelector('#watermark_font_size')
const watermark_color = document.querySelector('#watermark_color')
const watermark_stroke = document.querySelector('#watermark_stroke')
const source_images = document.querySelector('#source_images')
const preview_images = document.querySelector('#preview_images')

const read_image = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const image = new Image()
    image.title = file.name
    image.src = e.target.result
    resolve(image)
  }
  reader.onerror = (e) => {
    reject(e)
  }
  reader.readAsDataURL(file)
})

class ImageEditor {
  constructor(image) {
    this.image = image
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext("2d")
  }

  updateImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvas.width = this.image.width
    this.canvas.height = this.image.height
    this.ctx.drawImage(this.image, 0, 0)
    return this
  }

  updateText({
    text,
    font_size,
    font_family,
    color,
    stroke,
  }) {
    this.updateImage()
    this.ctx.font = `${font_size}px ${font_family}`
    if (stroke) {
      this.ctx.strokeStyle = color
      this.ctx.strokeText(text, 10, font_size)
    } else {
      this.ctx.fillStyle = color
      this.ctx.fillText(text, 10, font_size)
    }
    return this
  }
}

let editors = []

const get_watermark_options = () => {
  const text = watermark_text.value
  const font_size = watermark_font_size.value
  const font_family = watermark_font_family.value
  const color = watermark_color.value
  const stroke = watermark_stroke.checked

  return {
    text,
    font_size,
    font_family,
    color,
    stroke,
  }
}

const update_watermark = async () => {
  const watermark_options = get_watermark_options()
  console.log(watermark_options)
  for (const editor of editors) {
    editor.updateText(watermark_options)
  }
}

const update_images = async (files) => {
  const watermark_options = get_watermark_options()
  preview_images.innerHTML = ''
  for (const file of files) {
    const image = await read_image(file)
    const editor = new ImageEditor(image)
    editor.updateText(watermark_options)
    preview_images.append(editor.canvas)
    editors.push(editor)
  }
}

watermark_text.oninput = update_watermark
watermark_font_size.oninput = update_watermark
watermark_font_family.oninput = update_watermark
watermark_color.oninput = update_watermark
watermark_stroke.onchange = update_watermark

source_images.onchange = async (e) => {
  const files = e.target.files
  update_images(files)
}


