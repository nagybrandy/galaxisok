# Galaxisok

Hivatalos oldal a **Szabó Benedek és a Galaxisok** zenekarnak. A nyilvános site Next.js, a blogot a WordPress vezérli.

- Demo: [galaxisok.vercel.app](https://galaxisok.vercel.app) (`demo` branch)
- Éles domain később: [galaxisok.hu](https://galaxisok.hu)
- WordPress admin: [admin.galaxisok.hu](https://admin.galaxisok.hu)
- `main` branch: `coming` / `soon` → galaxisok.hu

## Branch-ek

| Branch | Mit mutat | Hol |
| --- | --- | --- |
| `demo` | Teljes landing + blog | Production a Vercelen (`galaxisok.vercel.app`) |
| `main` | Coming soon | Később a galaxisok.hu-ra |

## WordPress (headless)

1. WordPress az `admin.galaxisok.hu` alatt.
2. A Next.js a REST API-t olvassa: `/wp-json/wp/v2/posts`.
3. Vercel env: `WORDPRESS_URL=https://admin.galaxisok.hu`
4. Publikálás után cache-frissítés: `POST https://galaxisok.vercel.app/api/revalidate` headerrel `x-revalidate-secret: $WORDPRESS_REVALIDATE_SECRET`

## Social

- [Instagram](https://www.instagram.com/galaxisok)
- [Facebook](https://www.facebook.com/galaxisok)
- [YouTube](https://www.youtube.com/@galaxisok-r4l)
- [Spotify](https://open.spotify.com/artist/0oTbG6PYGGhT0vRYqByYEL)
- [Apple Music](https://music.apple.com/hu/artist/galaxisok/1458523130)
- [Bandcamp](https://galaxisok.bandcamp.com)
- [Deezer](https://www.deezer.com/artist/6206150)
- Levél: galaxisokmail@gmail.com
