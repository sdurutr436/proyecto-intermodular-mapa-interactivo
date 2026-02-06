# Development History - Transkarte

## Sprint Breakdown

The project was developed in 6 sprints using Scrum methodology, with the following characteristics:

| Sprint | Period | Hours | Main Components |
|--------|---------|-------|------------------------|
| **1** | Oct 31 - Nov 6 | 60.21 h | Initial setup, tech setup, Docker |
| **2** | Nov 7 - Nov 13 | 71.02 h | Translation systems, APIs, React components |
| **3** | Nov 14 - Nov 20 | 56.03 h | Interactive interface, world map, cache |
| **4** | Nov 21 - Nov 27 | 9.94 h | Dark mode, new mini-games |
| **5** | Nov 28 - Dec 4 | 17.90 h | Landing page, multi-language mode |
| **6** | Dec 5 - Dec 11 | 25.00 h | Testing, documentation, optimizations |
| **TOTAL** | | **244.35 h** | Complete and functional MVP product |

## Services and Operational Costs

### Recurring Infrastructure

| Service | Provider | Monthly Cost | Purpose |
|----------|-----------|---------------|-----------|
| Hosting | Railway | 5 €/month | Backend + Frontend |
| Database | MongoDB Atlas | Free | Storage (Free Tier) |
| Domain | Namecheap | ~1 €/month | .com domain |
| Translation | DeepL API | 5 €/month | Translation service |
| Monitoring | Sentry | Free | Error tracking (Free Tier) |
| **TOTAL** | | **~11 €/month** | **~132 €/year** |

### Cost Scale by Users

The cost model is designed to scale progressively according to the number of active users:

- **0-1,000 users**: ~10 €/month
- **1,000-5,000 users**: ~20 €/month
- **5,000-10,000 users**: ~54 €/month
- **10,000-50,000 users**: ~125 €/month

## Implemented Technologies

Development has used exclusively open-source technologies and economic services, minimizing operational costs:

- **Frontend**: React 18 + TypeScript + Vite (efficient build)
- **Backend**: Node.js + Express (lightweight and scalable)
- **Database**: MongoDB (flexible and free in initial phase)
- **Translation**: External APIs (DeepL + Google Translate as fallback)
- **Hosting**: Railway (economic and simple)
- **Monitoring**: Sentry (error detection)
