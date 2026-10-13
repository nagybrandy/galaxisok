# Galaxisok

Hivatalos oldal a **Szabó Benedek és a Galaxisok** zenekarnak. A nyilvános site Next.js, a blogot a WordPress vezérli.

- Éles oldal: [galaxisok.hu](https://galaxisok.hu) (`main` branch, Vercel production)
- Előnézet: [galaxisok-new.vercel.app](https://galaxisok-new.vercel.app) (ugyanaz a production build, noindex)
- WordPress admin: [admin.galaxisok.hu](https://admin.galaxisok.hu)

## Branch-ek

| Branch | Mit mutat | Hol |
| --- | --- | --- |
| `main` | Teljes oldal (landing + blog) | Production a Vercelen → galaxisok.hu |
| `dev` | Fejlesztés | Preview deploy, jelszavas kapu (`/kapu`) |
| `demo` | Régi bemutató ág | Preview (`galaxisok.vercel.app`) |

## WordPress (headless)

1. WordPress az `admin.galaxisok.hu` alatt.
2. A Next.js a REST API-t olvassa: `/wp-json/wp/v2/posts`.
3. Vercel env: `WORDPRESS_URL=https://admin.galaxisok.hu`
4. Publikálás után cache-frissítés: `POST https://galaxisok.hu/api/revalidate` headerrel `x-revalidate-secret: $WORDPRESS_REVALIDATE_SECRET`

## Social

- [Instagram](https://www.instagram.com/galaxisok)
- [Facebook](https://www.facebook.com/galaxisok)
- [YouTube](https://www.youtube.com/@galaxisok-r4l)
- [Spotify](https://open.spotify.com/artist/0oTbG6PYGGhT0vRYqByYEL)
- [Apple Music](https://music.apple.com/hu/artist/galaxisok/1458523130)
- [Bandcamp](https://galaxisok.bandcamp.com)
- [Deezer](https://www.deezer.com/artist/6206150)
- Levél: galaxisokmail@gmail.com
