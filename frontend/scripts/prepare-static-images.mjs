import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = fileURLToPath(new URL('..', import.meta.url))
const publicDir = join(projectDir, 'public')

const requiredSources = [
  'images/brushing-1.jpg',
  'images/bruski-na-sklade.jpg',
  'images/brusok-suhoi-stroganyi-45x45.jpg',
  'images/doska-estestvennoi-vlazhnosti-ognebiozashchita.jpg',
  'images/doska-kamernoi-sushki-25x100.jpg',
  'images/doska-s-ognebiozashchitoi.jpg',
  'images/doska-suhaya-ognebiozashchita.jpg',
  'images/doska-suhaya-stroganaya-45x95.jpg',
  'images/dostavka-pilomaterialov.jpg',
  'images/evrovagonka-12-5x95x3000.png',
  'images/imitatsiya-brusa-20x145.jpg',
  'images/imitatsiya-brusa-av-karelskii-ship.jpg',
  'images/imitatsiya-brusa-upakovka.jpg',
  'images/lentochnaya-pilorama-raspil.jpg',
  'images/lumber-stack-2025-03-07.jpg',
  'images/lumber-yard-2025-05-21.jpg',
  'images/pachki-reiki-i-bruska.jpg',
  'images/pilorama-stanok-brevno.jpg',
  'images/ploshchadka-otgruzka-pilomaterialov.jpg',
  'images/reika-suhaya-stroganaya-20x45.jpg',
  'images/sawmill-yard-1.jpg',
  'images/sawn-board-stack-2025-04-02.jpg',
  'images/shtabel-suhoi-doski.jpg',
  'images/sklad-obrabotannoi-doski.jpg',
  'images/timber-order-2025-05-16.jpg',
  'images/vagonka-shtil-12-5x120x3000.png',
  'mp4/short-sawmill-video.mp4',
]

for (const source of requiredSources) {
  await access(join(publicDir, source))
}

console.log(`Verified ${requiredSources.length} production media sources`)
