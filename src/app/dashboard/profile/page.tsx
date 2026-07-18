"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Groups flat permission keys ("clients:read") by their resource prefix so
// they read as a list of modules rather than a flat bag of strings.
function groupByResource(keys: string[]) {
  const map = new Map<string, string[]>();
  for (const key of keys) {
    const resource = key.split(":")[0];
    map.set(resource, [...(map.get(resource) ?? []), key]);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const groups = groupByResource(user.permissions);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>My profile</CardTitle>
          <CardDescription>Your own account details — visible to every signed-in user.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-sidebar-primary text-lg font-medium text-sidebar-primary-foreground">
              {getInitials(user.name)}
            </div>
            <div>
              <p className="text-base font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-medium">Roles</span>
            <div className="flex flex-wrap gap-1">
              {user.roles.length === 0 ? (
                <span className="text-sm text-muted-foreground">No roles assigned</span>
              ) : (
                user.roles.map((role) => (
                  <Badge key={role.id} variant="secondary">
                    {role.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My permissions</CardTitle>
          <CardDescription>
            What you can currently do — the union of your roles&apos; permissions and anything
            granted to you directly. Only an admin can change this.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No permissions granted yet — ask an admin to grant access to what you need.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {groups.map(([resource, keys]) => (
                <div key={resource} className="rounded-md border p-3">
                  <span className="text-sm font-semibold capitalize">{resource}</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {keys.map((key) => (
                      <Badge key={key} variant="outline" className="font-mono">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
