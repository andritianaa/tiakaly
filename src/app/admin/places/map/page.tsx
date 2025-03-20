import Image from "next/image";

export default async function RoutePage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-lg">
        <Image
          src="/placeholder.svg"
          fill
          alt=""
          className="object-cover rounded-xl"
        />
      </div>
    </div>
  );
}
