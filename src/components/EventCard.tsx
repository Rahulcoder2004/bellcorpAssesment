import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { Event } from "@/lib/api";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const availableSeats = event.capacity - event.registeredCount;
  const isSoldOut = availableSeats <= 0;
  const dateStr = new Date(event.date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <Link to={`/event/${event._id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md group">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">{event.category}</Badge>
            {isSoldOut ? (
              <Badge variant="destructive" className="text-xs">Sold Out</Badge>
            ) : (
              <span className="text-xs text-muted-foreground">{availableSeats} seats left</span>
            )}
          </div>
          <h3 className="font-semibold leading-tight line-clamp-1">{event.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{dateStr}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.registeredCount}/{event.capacity}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
