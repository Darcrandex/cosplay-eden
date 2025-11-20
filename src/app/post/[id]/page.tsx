import { getCosplayPostDetail } from '@/actions/scrape'

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('ppp', id)

  const detail = await getCosplayPostDetail(id)
  console.log('detail', detail)

  return (
    <>
      <h1>cosplaytele.com/{id}</h1>

      <h2>{detail?.title}</h2>

      <ol className="mx-auto w-lg space-y-4">
        {detail?.imageList.map((item) => (
          <li key={item}>
            <img src={item} alt="" className="block h-48 w-full object-cover" />
          </li>
        ))}
      </ol>
    </>
  )
}
