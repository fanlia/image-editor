import './style.css'

// ─── DOM refs ───────────────────────────────────────────────────────────────
const watermark_text = document.querySelector('#watermark_text')
const watermark_font_family = document.querySelector('#watermark_font_family')
const watermark_font_size = document.querySelector('#watermark_font_size')
const watermark_color = document.querySelector('#watermark_color')
const watermark_opacity = document.querySelector('#watermark_opacity')
const watermark_stroke = document.querySelector('#watermark_stroke')
const watermark_count = document.querySelector('#watermark_count')
const source_images = document.querySelector('#source_images')
const preview_images = document.querySelector('#preview_images')
const load_watermark_options = document.querySelector('#load_watermark_options')
const store_watermark_options = document.querySelector('#store_watermark_options')
const image_count = document.querySelector('#image_count')

// range value displays
const font_size_val = document.querySelector('#watermark_font_size_val')
const opacity_val = document.querySelector('#watermark_opacity_val')
const count_val = document.querySelector('#watermark_count_val')
const color_hex = document.querySelector('#watermark_color_hex')

// ─── Helpers ────────────────────────────────────────────────────────────────
const read_image = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = new Image()
      image.title = file.name
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

// ─── Image Editor Core ──────────────────────────────────────────────────────
class ImageEditor {
  constructor(image) {
    this.image = image
    this.canvas = document.createElement('canvas')
    this.canvas.className =
      'rounded-lg border border-gray-700 shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer max-w-full h-auto'
    this.ctx = this.canvas.getContext('2d')
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
    ctx.moveTo(p1.x + x_offset, p1.y)
    ctx.lineTo(p2.x + x_offset, p2.y)
    ctx.stroke()
  }

  updateText({ text, font_size, font_family, color, stroke, opacity, count }) {
    this.updateImage()

    const ctx = this.ctx
    ctx.globalAlpha = opacity / 100
    ctx.font = `${font_size}px ${font_family}`
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 4
    ctx.textBaseline = 'middle'

    const { width: text_width } = ctx.measureText(text)
    const cols = count
    const rows = count
    const cellW = Math.round(this.canvas.width / cols)
    const cellH = Math.round(this.canvas.height / rows)

    const points_list = []
    for (let i = 0; i < rows; i++) {
      const points = []
      for (let j = 0; j < cols; j++) {
        points.push({ x: i * cellW, y: j * cellH + font_size, i, j })
      }
      points_list.push(points)
    }

    for (const point of points_list.flat()) {
      const { x, y, i, j } = point
      if ((i + j) % 2 !== 0) continue

      if (stroke) {
        ctx.strokeText(text, x, y)
      } else {
        ctx.fillText(text, x, y)
      }

      if (i === rows - 1) continue
      const x_offset = text_width / 2
      const y_offset = font_size / 2

      if (j === 0) {
        const se = points_list[i + 1][j + 1]
        this.drawLine(point, se, x_offset, y_offset)
      } else if (j === cols - 1) {
        const sw = points_list[i + 1][j - 1]
        this.drawLine(sw, point, x_offset, y_offset)
      } else {
        const se = points_list[i + 1][j + 1]
        this.drawLine(point, se, x_offset, y_offset)
        const sw = points_list[i + 1][j - 1]
        this.drawLine(sw, point, x_offset, y_offset)
      }
    }
    return this
  }
}

let editors = []

// ─── Options IO ─────────────────────────────────────────────────────────────
const get_watermark_options = () => ({
  text: watermark_text.value,
  font_size: +watermark_font_size.value,
  font_family: watermark_font_family.value,
  color: watermark_color.value,
  stroke: watermark_stroke.checked,
  opacity: +watermark_opacity.value,
  count: +watermark_count.value,
})

const update_watermark = () => {
  const opts = get_watermark_options()
  for (const editor of editors) {
    editor.updateText(opts)
  }
}

const download = (canvas, file) => {
  canvas.toBlob((blob) => {
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    a.download = file.name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }, file.type)
}

const update_images = async (files) => {
  const opts = get_watermark_options()
  preview_images.innerHTML = ''
  editors = []

  for (const file of files) {
    const image = await read_image(file)
    const editor = new ImageEditor(image)
    editor.updateText(opts)
    const canvas = editor.canvas
    canvas.onclick = () => download(canvas, file)
    preview_images.appendChild(canvas)
    editors.push(editor)
  }

  image_count.textContent = `${editors.length} 张`
  if (editors.length === 0) {
    preview_images.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-gray-500">
        <svg class="mb-2 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>请先选择图片</p>
      </div>`
  }
}

// ─── Events ─────────────────────────────────────────────────────────────────
watermark_text.oninput = update_watermark
watermark_font_family.onchange = update_watermark
watermark_color.oninput = () => {
  color_hex.textContent = watermark_color.value
  update_watermark()
}
watermark_stroke.onchange = update_watermark

watermark_font_size.oninput = () => {
  font_size_val.textContent = `${watermark_font_size.value}px`
  update_watermark()
}
watermark_opacity.oninput = () => {
  opacity_val.textContent = `${watermark_opacity.value}%`
  update_watermark()
}
watermark_count.oninput = () => {
  count_val.textContent = watermark_count.value
  update_watermark()
}

source_images.onchange = (e) => {
  update_images(e.target.files)
}

load_watermark_options.onclick = () => {
  const raw = localStorage.getItem('watermark_options')
  if (!raw) return
  try {
    const { text, font_size, font_family, color, stroke, opacity, count } =
      JSON.parse(raw)
    watermark_text.value = text ?? 'watermark'
    watermark_font_size.value = font_size ?? 50
    watermark_font_family.value = font_family ?? 'sans-serif'
    watermark_color.value = color ?? '#FFFFFF'
    watermark_stroke.checked = stroke ?? false
    watermark_opacity.value = opacity ?? 20
    watermark_count.value = count ?? 5
    // refresh displays
    font_size_val.textContent = `${watermark_font_size.value}px`
    opacity_val.textContent = `${watermark_opacity.value}%`
    count_val.textContent = watermark_count.value
    color_hex.textContent = watermark_color.value
  } catch {
    /* ignore */
  }
  update_watermark()
}

store_watermark_options.onclick = () => {
  const opts = get_watermark_options()
  localStorage.setItem('watermark_options', JSON.stringify(opts))
  // toast notification
  const toast = document.createElement('div')
  toast.className =
    'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300'
  toast.textContent = '✅ 保存成功'
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}
