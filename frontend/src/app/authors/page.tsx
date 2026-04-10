import { CICSFooter, CICSHeader, SecondaryNav, Sidebar } from '@/components/layout'

const AUTHOR_GROUPS: Record<string, string[]> = {
  A: ['Aragon, Lianne Marie'],
  B: ['Bautista, Noel Vincent', 'Bernardo, Keziah Mae'],
  C: ['Cabrera, Eliseo Miguel'],
  D: ['Del Rosario, Andrea Nicole', 'Domingo, Ryan Paolo'],
  E: ['Enriquez, Tricia Anne'],
  F: ['Flores, Mateo Gabriel'],
  G: ['Gonzales, Patricia Lou'],
  H: ['Hernandez, Joaquin Luis'],
  I: [],
  J: ['Javier, Danielle Cruz'],
  K: ['King, Marcus Allen'],
  L: ['Lim, Sophia Therese'],
  M: ['Mendoza, Zachary Cole'],
  N: ['Navarro, Elena Faith'],
  O: ['Ocampo, Andre Luis'],
  P: ['Pineda, Carissa Joy'],
  Q: ['Quimson, Rafael Jude'],
  R: ['Ramos, Isabelle Grace'],
  S: ['Santos, Dominic Kyle'],
  T: ['Torres, Bianca Camille'],
  U: [],
  V: ['Valdez, Hannah Paige'],
  W: ['Wu, Cedric James'],
  X: [],
  Y: ['Yu, Clarisse Anne'],
  Z: ['Zamora, Miguel Andres'],
}

const LETTERS = Object.keys(AUTHOR_GROUPS)

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-bg-grey flex flex-col">
      <CICSHeader />

      <SecondaryNav
        title="Author"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Authors' },
        ]}
      />

      <div className="flex flex-1 px-8 lg:px-[300px] gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0 pt-7 pb-8">
          <p className="font-body text-[14px] leading-[24px] text-[#555] mb-4">
            Listing of authors who have works in the repository. Click the name of an author to see a listing of that person&apos;s work.
          </p>

          <div className="relative border-b border-[#d6d4d4] pb-[11px] mb-5">
            <h1 className="font-heading text-[32px] leading-[30px] text-[#555]">Browse by Author</h1>
            <div className="absolute left-0 bottom-[-1px] h-[3px] w-[95px] bg-[#f3aa2c] rounded-tr-[5px] rounded-br-[5px]" />
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-6">
            {LETTERS.map((letter) => (
              <a key={letter} href={`#author-${letter}`} className="font-body text-[20px] leading-none text-cics-maroon hover:underline no-underline">
                {letter}
              </a>
            ))}
          </div>

          <div className="space-y-6">
            {LETTERS.map((letter) => {
              const names = AUTHOR_GROUPS[letter]
              if (names.length === 0) return null

              return (
                <section key={letter} id={`author-${letter}`} className="scroll-mt-24">
                  <h2 className="font-heading text-[36px] text-cics-maroon leading-none mb-2">{letter}</h2>
                  <div className="flex flex-col gap-1">
                    {names.map((name) => (
                      <a
                        key={name}
                        href="/search"
                        className="font-body text-[15px] text-cics-maroon hover:underline w-fit"
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </main>
      </div>

      <CICSFooter />
    </div>
  )
}