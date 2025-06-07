import { get } from 'svelte/store'
import { empresa } from '../store'
import { getConfiguracoes, Tamanho } from './settings'

export enum Metodo {
  /** Change the image to blank and white using a simple threshold */
  threshold,
  /** Change the image to blank and white using the Bayer algorithm */
  bayer,
  /** Change the image to blank and white using the Floyd-Steinberg algorithm */
  floydsteinberg,
  /** Change the image to blank and white using the Atkinson algorithm */
  atkinson,
}

export async function getLogotipo() {
  const logotipo = get(empresa).logotipo
  if (!logotipo) return undefined
  const imageUrl = logotipo.imagem
  const maxWidth = getConfiguracoes().width
  const tamanho = logotipo.tamanho
  const metodo = logotipo.pixelizacao
  return await pixelizarImageUrl(imageUrl, maxWidth, tamanho, metodo)
}

export async function pixelizarImageUrl(
  imageUrl: string,
  maxWidth: number,
  tamanho: Tamanho,
  metodo: Metodo,
  canvas?: HTMLCanvasElement
) {
  if (!canvas) canvas = document.createElement('canvas')

  const image = new Image()
  await new Promise<void>((v) => {
    image.onload = () => v()
    image.src = imageUrl
  })

  const srcWidth = image.width
  const srcHeight = image.height
  const width = Math.floor((srcWidth * maxWidth * tamanho) / srcWidth)
  const height = Math.round((srcHeight * width) / srcWidth)

  canvas.width = image.width = width
  canvas.height = image.height = height

  return await pixelizarImagem(image, canvas, metodo)
}

export async function pixelizarImagem(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  metodo: Metodo
) {
  canvas.width = image.width
  canvas.height = image.height

  const context = canvas.getContext('2d')!
  context.drawImage(image, 0, 0, image.width, image.height)
  const imageData = context.getImageData(0, 0, image.width, image.height)

  switch (metodo) {
    case Metodo.threshold: {
      const threshold = 128

      for (let i = 0; i < imageData.data.length; i += 4) {
        const luminance =
          imageData.data[i] * 0.299 +
          imageData.data[i + 1] * 0.587 +
          imageData.data[i + 2] * 0.114
        const value = luminance < threshold ? 255 : 0
        imageData.data.fill(0, i, i + 3)
        imageData.data[i + 3] = value
      }
      break
    }
    case Metodo.bayer: {
      const threshold = 128

      const thresholdMap = [
        [15, 135, 45, 165],
        [195, 75, 225, 105],
        [60, 180, 30, 150],
        [240, 120, 210, 90],
      ]

      for (let i = 0; i < imageData.data.length; i += 4) {
        const luminance =
          imageData.data[i] * 0.299 +
          imageData.data[i + 1] * 0.587 +
          imageData.data[i + 2] * 0.114

        const x = (i / 4) % imageData.width
        const y = Math.floor(i / 4 / imageData.width)
        const map = Math.floor((luminance + thresholdMap[x % 4][y % 4]) / 2)
        const value = map < threshold ? 255 : 0
        imageData.data.fill(0, i, i + 3)
        imageData.data[i + 3] = value
      }
      break
    }
    case Metodo.floydsteinberg: {
      const width = imageData.width
      const luminance = new Uint8ClampedArray(
        imageData.width * imageData.height
      )

      for (let l = 0, i = 0; i < imageData.data.length; l++, i += 4) {
        luminance[l] =
          imageData.data[i] * 0.299 +
          imageData.data[i + 1] * 0.587 +
          imageData.data[i + 2] * 0.114
      }

      for (let l = 0, i = 0; i < imageData.data.length; l++, i += 4) {
        const value = luminance[l] < 129 ? 0 : 255
        const outValue = luminance[l] < 129 ? 255 : 0
        imageData.data.fill(0, i, i + 3)
        imageData.data[i + 3] = outValue

        const error = Math.floor((luminance[l] - value) / 16)
        luminance[l + 1] += error * 7
        luminance[l + width - 1] += error * 3
        luminance[l + width] += error * 5
        luminance[l + width + 1] += error * 1
      }
      break
    }
    case Metodo.atkinson: {
      const width = imageData.width
      const luminance = new Uint8ClampedArray(
        imageData.width * imageData.height
      )

      for (let l = 0, i = 0; i < imageData.data.length; l++, i += 4) {
        luminance[l] =
          imageData.data[i] * 0.299 +
          imageData.data[i + 1] * 0.587 +
          imageData.data[i + 2] * 0.114
      }

      for (let l = 0, i = 0; i < imageData.data.length; l++, i += 4) {
        const value = luminance[l] < 129 ? 0 : 255
        const outValue = luminance[l] < 129 ? 255 : 0
        imageData.data.fill(0, i, i + 3)
        imageData.data[i + 3] = outValue

        const error = Math.floor((luminance[l] - value) / 8)
        luminance[l + 1] += error
        luminance[l + 2] += error
        luminance[l + width - 1] += error
        luminance[l + width] += error
        luminance[l + width + 1] += error
        luminance[l + 2 * width] += error
      }
      break
    }
  }

  context.putImageData(imageData, 0, 0)
  return imageData
}