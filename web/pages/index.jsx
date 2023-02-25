import HomeEmptyMessage from "src/components/HomeEmptyMessage"
import LatestMarketplaceItems from "src/components/LatestMarketplaceItems"
import LatestStoreItems from "src/components/LatestStoreItems"
import PageTitle from "src/components/PageTitle"
import useApiListings from "src/hooks/useApiListings"
import useAppContext from "src/hooks/useAppContext"

export default function Home() {
  const {listings, isLoading} = useApiListings()

  // Check for owner address
  const {currentUser, setFlashMessage, switchToAdminView} = useAppContext()
  const address = currentUser ? currentUser.addr : null

  const genListings = (addr, array) => {
    if (!addr) {
      return array
    } else if (array && addr[2] % 2 > 0) {
      return array.slice(4, 10)
    } else if (array && addr[2] % 2 == 0) {
      return array.slice(1, 4)
    } else {
      return array
    }
  }

  const curated_listings = genListings(address, listings)
  // const curated_listings = listings

  return (
    <div>
      <PageTitle>Store</PageTitle>
      <main>
        {!isLoading &&
          (curated_listings && curated_listings.length > 0 ? (
            <div>
              <LatestStoreItems items={curated_listings} />
              {/* <LatestMarketplaceItems items={curated_listings} /> */}
            </div>
          ) : (
            <HomeEmptyMessage />
          ))}
      </main>
    </div>
  )
}
