import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href='/' className="flex">
          <Image
            src="/assets/images/new-logo.svg"
            alt="logo"
            width={30}
            height={28}
            className="h-auto"
          />
           <h5 className="font-semibold text-xl ml-2">Tech Events</h5>
        </Link>

        <p>2024 nFactorial Incubator.</p>
      </div>
    </footer>
  )
}

export default Footer
