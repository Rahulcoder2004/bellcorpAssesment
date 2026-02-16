import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Search, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bellcorp Event Management
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover, explore, and register for events happening near you. From tech conferences to community meetups — find your next experience.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/events">
              <Search className="mr-2 h-4 w-4" />
              Browse Events
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/register">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
