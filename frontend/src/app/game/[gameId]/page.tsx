import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { gameRegistry } from "@/games/gameRegistry";

interface Props {
  params: Promise<{
    gameId: string;
  }>;
}

export default async function GamePage({ params }: Props) {
  const { gameId } = await params;

  const isValidGameId = gameId in gameRegistry;

  if (!isValidGameId) {
    notFound();
  }

  const game = gameRegistry[gameId as keyof typeof gameRegistry];
  const GameComponent = game.component;

  return (
    <main className="relative min-h-screen lg:h-dvh lg:max-h-dvh w-full overflow-x-hidden lg:overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat transition-all duration-500 bg-[url('/background/bg2.png')] dark:bg-[url('/background/bg3.png')]">
      
      {/* Background Overlay Layer */}
      <div className="absolute inset-0 bg-indigo-950/5 dark:bg-indigo-950/20 pointer-events-none z-10" />

      {/* Main Structural Application Grid Container */}
      <div className="relative z-20 mx-auto flex h-auto lg:h-full w-full max-w-[1280px] flex-col px-3 sm:px-4 md:px-8 pt-20 md:pt-28 pb-6 lg:overflow-hidden">
        
        <TopBar />

        {/* Dynamic Game Component Display Frame */}
        <div className="flex flex-1 flex-col items-center justify-start lg:justify-center overflow-y-auto lg:overflow-hidden mt-4 lg:mt-0 w-full">
          <GameComponent />
        </div>
        
      </div>
    </main>
  );
}