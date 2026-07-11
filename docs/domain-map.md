# Domain Map — layout material for tldraw

| Raindrop feature                                        | ResourceLake v1                                                       | Where it lands                         |
| ------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| Bookmarks (raindrops)                                   | ✅ **Resource**                                                       | [[contexts/resources]]                 |
| Content types (link/article/image/video/document/audio) | ✅ split into two axes: **type** (payload) + **Category** (kind)      | [[decisions/0004-category-fixed-enum]] |
| Collections                                             | ✅ **Collection**                                                     | [[contexts/organization]]              |
| Nested collections                                      | ✅ `parentId` tree                                                    | [[contexts/organization]]              |
| Tags                                                    | ✅ **Tag** (entity)                                                   | [[decisions/0001-tag-as-entity]]       |
| Highlights                                              | ✅ **Highlight** (owned by Resource)                                  | [[contexts/resources]]                 |
| Filters                                                 | 🟡 **deferred** — a query/read concern, not domain                    | out of v1                              |
| Favorites                                               | 🟡 **deferred** — simple `favorite: bool` flag on Resource, add later | later                                  |
| Reminders                                               | 🟡 **deferred** — own small aggregate later                           | later                                  |
| Search                                                  | 🟡 **deferred** — read-side / index                                   | later                                  |
| Import / Export                                         | 🟡 **deferred**                                                       | later                                  |

---
