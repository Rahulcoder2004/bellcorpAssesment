import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventsApi, registrationApi, type Event } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, MapPin, Users, User, ArrowLeft } from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    eventsApi.getById(id).then(e => {
      setEvent(e);
      setRegistered(registrationApi.isRegistered(e._id));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  const handleRegister = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!event) return;
    setActionLoading(true);
    try {
      await registrationApi.register(event._id);
      setRegistered(true);
      setEvent({ ...event, registeredCount: event.registeredCount + 1 });
      toast({ title: "Registered!", description: `You're signed up for ${event.name}` });
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!event) return;
    setActionLoading(true);
    try {
      await registrationApi.cancel(event._id);
      setRegistered(false);
      setEvent({ ...event, registeredCount: event.registeredCount - 1 });
      toast({ title: "Registration cancelled" });
    } catch (err: any) {
      toast({ title: "Cancellation failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-8"><div className="animate-pulse space-y-4"><div className="h-64 bg-muted rounded-lg" /><div className="h-8 bg-muted rounded w-1/2" /><div className="h-4 bg-muted rounded w-full" /></div></div>;
  }

  if (!event) {
    return <div className="container py-16 text-center text-muted-foreground">Event not found</div>;
  }

  const availableSeats = event.capacity - event.registeredCount;
  const isSoldOut = availableSeats <= 0;
  const dateStr = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const timeStr = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit",
  });

  return (
    <div className="container py-8 max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <div className="rounded-lg overflow-hidden aspect-[2/1] bg-muted">
        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Badge variant="secondary">{event.category}</Badge>
            <h1 className="text-3xl font-bold mt-2">{event.name}</h1>
          </div>
          {isSoldOut && !registered ? (
            <Badge variant="destructive" className="text-sm px-3 py-1">Sold Out</Badge>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{dateStr} at {timeStr}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
          <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{event.organizer}</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{event.registeredCount}/{event.capacity} registered</span>
        </div>

        <Card>
          <CardContent className="p-5">
            <p className="leading-relaxed">{event.description}</p>
          </CardContent>
        </Card>

        {/* Registration CTA */}
        <div className="pt-2">
          {registered ? (
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 text-white">✓ Registered</Badge>
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={actionLoading}>
                Cancel Registration
              </Button>
            </div>
          ) : isLoggedIn ? (
            availableSeats > 0 ? (
              <Button onClick={handleRegister} disabled={actionLoading}>
                {actionLoading ? "Registering…" : `Register Now — ${availableSeats} seats left`}
              </Button>
            ) : (
              <p className="text-destructive font-medium">This event is sold out</p>
            )
          ) : (
            <Button onClick={() => navigate("/login")}>Login to Register</Button>
          )}
        </div>
      </div>
    </div>
  );
}
