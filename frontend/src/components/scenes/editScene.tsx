import { useState } from "react";
import Image from "next/image";
import { Scene } from "../../pages/index";

const EditScene = ({ setScene }) => {
  const [isHopping, setIsHopping] = useState(false);

  const handleClick = () => {
    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 1000); // Reset after 1 second
  };

  return (
    <div className="flex flex-col items-center m-auto">
      <header className="p-2 w-3/4">
        <div className="flex justify-between items-center w-20 rounded-md bg-darkgray mt-4 pl-2 pr-2">
          <Image src="/images/edit/stage.png" alt="" width={16} height={16} />
          <div className="text-lg font-bold">1</div>
        </div>
      </header>
      <main
        className="flex flex-col"
        style={{ width: "800px", margin: "auto" }}
      >
        <section className="mt-8">
          <div className="flex justify-end bg-darkgray p-4 rounded-lg">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="m-2" key={index}>
                <Image
                  src="/images/cards/card-null.png"
                  alt=""
                  width={144}
                  height={16}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <div className="flex justify-end p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="m-2" key={index}>
                <Image
                  src="/images/cards/card-null.png"
                  alt=""
                  width={144}
                  height={16}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <div className="text-center">
            <button
              className="bg-sub font-bold px-8 py-3 rounded-md text-decoration-none"
              onClick={() => setScene(Scene.Battle)}
            >
              Play
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditScene;
