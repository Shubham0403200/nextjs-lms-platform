export default function Authlayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-[#e9dedd] h-full items-center flex justify-center">
        {children}
    </div>
  )
}
