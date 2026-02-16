import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registrationApi, type Registration } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return; }
    registrationApi.getMyRegistrations().then(data => {
      setRegistrations(data);
      setLoading(false);
    });
  }, [isLoggedIn, navigate]);

  const now = new Date();
  const upcoming = registrations.filter(r => new Date(r.event.date) >= now);
  const past = registrations.filter(r => new Date(r.event.date) < now);

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card animate-pulse">
              <div className="aspect-[16/9] bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No registrations yet</p>
          <p className="text-sm">Browse events and register to see them here</p>
        </div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="pt-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No upcoming events</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map(r => <EventCard key={r._id} event={r.event} />)}
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="pt-4">
            {past.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No past events</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {past.map(r => <EventCard key={r._id} event={r.event} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
