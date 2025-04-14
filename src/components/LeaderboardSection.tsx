import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardTable from "./LeaderboardTable";
import { useGroup } from "@/contexts/GroupContext";

const LeaderboardSection = () => {
  const [range, setRange] = useState<"weekly" | "monthly" | "yearly" | "all">("weekly");
  const { currentGroup, leaderboard, fetchLeaderboard } = useGroup();

  useEffect(() => {
    if (currentGroup?.id) {
      fetchLeaderboard(currentGroup.id.toString(), range);
    }
  }, [range, currentGroup?.id]);

  return (
    <Tabs defaultValue="weekly" value={range} onValueChange={(value) => setRange(value)}>
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
        <TabsTrigger value="all">All Time</TabsTrigger>
      </TabsList>

      <TabsContent value={range}>
        <LeaderboardTable leaderboard={leaderboard} showMedals />
      </TabsContent>
    </Tabs>
  );
};

export default LeaderboardSection;
