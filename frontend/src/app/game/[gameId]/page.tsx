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
    <main 
      className="relative h-screen max-h-screen w-full overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat transition-all duration-500 bg-[url('/background/bg2.png')] dark:bg-[url('/background/bg3.png')]"
    >
      <div className="absolute inset-0 bg-indigo-950/5 dark:bg-indigo-950/20 pointer-events-none z-0" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col px-4 md:px-8 pt-28 overflow-hidden">
        
        <TopBar />

        <div className="flex flex-1 flex-col items-center justify-center overflow-hidden">
          <GameComponent />
        </div>
        
      </div>
    </main>
  );
}