import './style.css'

document.querySelector('#app').innerHTML = `
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
    <input type="range" name="watermark_opacity" id="watermark_opacity" value="10"/>
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
    <div id="preview_images">请先选择图片</div>
  </div>
`

const watermark_text = document.querySelector('#watermark_text')
const watermark_font_family = document.querySelector('#watermark_font_family')
const watermark_font_size = document.querySelector('#watermark_font_size')
const watermark_color = document.querySelector('#watermark_color')
const watermark_opacity = document.querySelector('#watermark_opacity')
const watermark_stroke = document.querySelector('#watermark_stroke')
const source_images = document.querySelector('#source_images')
const preview_images = document.querySelector('#preview_images')
const load_watermark_options = document.querySelector('#load_watermark_options')
const store_watermark_options = document.querySelector('#store_watermark_options')

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

  drawLine(p1, p2, x_offset, y_offset) {
    const ctx = this.ctx

    ctx.beginPath()
    ctx.moveTo(p1.x + x_offset, p1.y + y_offset)
    ctx.lineTo(p2.x + x_offset, p2.y - y_offset)
    ctx.stroke()
  }

  updateText({
    text,
    font_size,
    font_family,
    color,
    stroke,
    opacity,
  }) {
    this.updateImage()

    // set style
    const ctx = this.ctx
    ctx.globalAlpha = opacity / 100
    ctx.font = `${font_size}px ${font_family}`
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 4
    ctx.textBaseline = 'middle'

    const { width: text_width } = ctx.measureText(text)

    // calculate points
    const rows = 4
    const cols = 4

    const width = Math.round(this.canvas.width / cols)
    const height = Math.round(this.canvas.height / rows)

    let points_list = []
    for (let i = 0; i < rows; i++) {
      let points = []
      for (let j = 0; j < cols; j++) {
        const x = i * width
        const y = j * height + font_size

        points.push({
          x,
          y,
          i,
          j,
        })
      }
      points_list.push(points)
    }

    for (const point of points_list.flat()) {
      const {x, y, i, j} = point
      const enabled = (i + j) % 2 === 0
      if (!enabled) {
        continue
      }

      // draw text
      if (stroke) {
        ctx.strokeText(text, x, y)
      } else {
        ctx.fillText(text, x, y)
      }

      if (i === rows - 1) {
        continue
      }

      const x_offset = text_width / 2
      const y_offset = font_size / 2

      // draw lines
      if (j === 0) {
        const se = points_list[i+1][j+1]
        this.drawLine(point, se, x_offset, y_offset)
      } else if (j === cols - 1) {
        const sw = points_list[i+1][j-1]
        this.drawLine(sw, point, x_offset, y_offset)
      } else {
        const se = points_list[i+1][j+1]
        this.drawLine(point, se, x_offset, y_offset)
        const sw = points_list[i+1][j-1]
        this.drawLine(sw, point, x_offset, y_offset)
      }
    }
    return this
  }
}

let editors = []

const get_watermark_options = () => {
  const text = watermark_text.value
  const font_size = +watermark_font_size.value
  const font_family = watermark_font_family.value
  const color = watermark_color.value
  const stroke = watermark_stroke.checked
  const opacity = +watermark_opacity.value

  return {
    text,
    font_size,
    font_family,
    color,
    stroke,
    opacity,
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
watermark_opacity.oninput = update_watermark

source_images.onchange = async (e) => {
  const files = e.target.files
  update_images(files)
}

load_watermark_options.onclick = () => {
  const watermark_options_string = localStorage.getItem('watermark_options')
  if (!watermark_options_string) return

  try {
    const {
      text,
      font_size,
      font_family,
      color,
      stroke,
      opacity,
    } = JSON.parse(watermark_options_string)
    watermark_text.value = text
    watermark_font_size.value = font_size
    watermark_font_family.value = font_family
    watermark_color.value = color
    watermark_stroke.checked = stroke
    watermark_opacity.value = opacity
  } catch (e) {}
}

store_watermark_options.onclick = () => {
  const watermark_options = get_watermark_options()
  localStorage.setItem('watermark_options', JSON.stringify(watermark_options))
  alert('保存成功')
}

