export function ItemLockIcon() {
  return (
    <div className="absolute w-full h-full z-10">
      <div
        className="absolute left-[-4px] bottom-[-4px] w-[30px] h-[30px] bg-contain"
        style={{
          backgroundImage: `url('/images/black-smith/sealing_lock.png')`,
        }}
      />
    </div>
  )
}
