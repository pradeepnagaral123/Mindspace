import MoodCheckIn from "../components/MoodCheckIn";
import QuoteCard from "../components/QuoteCard";
import ConnectionsCard from "../components/ConnectionsCard";
import RecommendedCommunities from "../components/RecommendedCommunities";
import DailyCheckIn from "../components/DailyCheckIn";
import CommunityFeed from "../components/CommunityFeed";
import UpcomingEvents from "../components/UpcomingEvents";
import EmergencySupportCard from "../components/EmergencySupportCard";

export default function Dashboard() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <MoodCheckIn className="lg:col-span-2" />
        <QuoteCard />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <ConnectionsCard />
        <RecommendedCommunities />
        <DailyCheckIn />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
        <CommunityFeed />
        <div className="space-y-5 lg:space-y-6">
          <UpcomingEvents />
          <EmergencySupportCard />
        </div>
      </div>
    </div>
  );
}
