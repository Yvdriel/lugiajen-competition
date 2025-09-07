"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import Image from "next/image";

interface Competition {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isOpen: boolean;
  createdAt: string;
}

interface Contestant {
  id: string;
  firstName: string;
  lastName: string;
  karateSchool: string;
  beltColor: string;
  age: number;
  email: string;
  kata: boolean;
  kumite: boolean;
  paid: boolean;
  competition: Competition;
  createdAt: string;
}

export function AdminDashboard() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
  });
  const [selectedCompetitionId, setSelectedCompetitionId] =
    useState<string>("");
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    beltColors: [] as string[],
    ageMin: "",
    ageMax: "",
    type: "all" as "all" | "kata" | "kumite" | "both",
    paymentStatus: "all" as "all" | "paid" | "pending",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [competitionsRes, contestantsRes] = await Promise.all([
        fetch("/api/competitions"),
        fetch("/api/contestants"),
      ]);

      if (competitionsRes.ok) {
        const competitionsData = await competitionsRes.json();
        setCompetitions(competitionsData);

        // Set default to active competition
        const activeCompetition = competitionsData.find(
          (c: Competition) => c.isActive
        );
        if (activeCompetition) {
          setSelectedCompetitionId(activeCompetition.id);
        } else if (competitionsData.length > 0) {
          // If no active, default to first competition
          setSelectedCompetitionId(competitionsData[0].id);
        }
      }

      if (contestantsRes.ok) {
        const contestantsData = await contestantsRes.json();
        setContestants(contestantsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCompetition = async () => {
    try {
      const response = await fetch("/api/competitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompetition),
      });

      if (response.ok) {
        setNewCompetition({ name: "", description: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  const filteredContestants = selectedCompetitionId
    ? contestants
        .filter(
          (contestant) => contestant.competition.id === selectedCompetitionId
        )
        .filter((contestant) => {
          // Belt color filter
          if (filters.beltColors.length > 0) {
            return filters.beltColors.includes(contestant.beltColor);
          }
          return true;
        })
        .filter((contestant) => {
          // Age range filter
          const age = contestant.age;
          const minAge = filters.ageMin ? parseInt(filters.ageMin) : 0;
          const maxAge = filters.ageMax ? parseInt(filters.ageMax) : 100;
          return age >= minAge && age <= maxAge;
        })
        .filter((contestant) => {
          // Type filter
          switch (filters.type) {
            case "kata":
              return contestant.kata;
            case "kumite":
              return contestant.kumite;
            case "both":
              return contestant.kata && contestant.kumite;
            default:
              return true;
          }
        })
        .filter((contestant) => {
          // Payment status filter
          switch (filters.paymentStatus) {
            case "paid":
              return contestant.paid;
            case "pending":
              return !contestant.paid;
            default:
              return true;
          }
        })
    : contestants;

  const clearFilters = () => {
    setFilters({
      beltColors: [],
      ageMin: "",
      ageMax: "",
      type: "all",
      paymentStatus: "all",
    });
  };

  const updateBeltColorFilter = (beltColor: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      beltColors: checked
        ? [...prev.beltColors, beltColor]
        : prev.beltColors.filter((color) => color !== beltColor),
    }));
  };

  const hasActiveFilters = () => {
    return (
      filters.beltColors.length > 0 ||
      filters.ageMin !== "" ||
      filters.ageMax !== "" ||
      filters.type !== "all" ||
      filters.paymentStatus !== "all"
    );
  };

  // Get unique belt colors from contestants
  const availableBeltColors = Array.from(
    new Set(
      contestants
        .filter((c) => c.competition.id === selectedCompetitionId)
        .map((c) => c.beltColor)
    )
  ).sort();

  const toggleCompetitionStatus = async (
    id: string,
    field: "isActive" | "isOpen"
  ) => {
    try {
      const response = await fetch(`/api/competitions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: !competitions.find((c) => c.id === id)?.[field],
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating competition:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4  mb-8 justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo-small.png"
              alt="Karate Toernooi Logo"
              width={66}
              height={100}
            />
            <Image
              src="/images/logo-text.png"
              alt="Karate Toernooi Logo"
              width={200}
              height={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Competition */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Competition</CardTitle>
              <CardDescription>
                Add a new karate tournament competition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Competition Name</Label>
                <Input
                  id="name"
                  value={newCompetition.name}
                  onChange={(e) =>
                    setNewCompetition((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Spring Karate Tournament 2025"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCompetition.description}
                  onChange={(e) =>
                    setNewCompetition((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Annual karate competition"
                />
              </div>
              <Button
                onClick={createCompetition}
                className="w-full hover:cursor-pointer"
              >
                Create Competition
              </Button>
            </CardContent>
          </Card>

          {/* Competition Management */}
          <Card>
            <CardHeader>
              <CardTitle>Competition Management</CardTitle>
              <CardDescription>Manage existing competitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitions.map((competition) => (
                  <div key={competition.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{competition.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {competition.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            className="hover:cursor-pointer"
                            checked={competition.isActive}
                            onCheckedChange={() =>
                              toggleCompetitionStatus(
                                competition.id,
                                "isActive"
                              )
                            }
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            className="hover:cursor-pointer"
                            checked={competition.isOpen}
                            onCheckedChange={() =>
                              toggleCompetitionStatus(competition.id, "isOpen")
                            }
                          />
                          <Label>Open for Registration</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contestants Table */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registered Contestants</CardTitle>
                <CardDescription>
                  View registered contestants for selected competition
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="competition-select">Competition:</Label>
                <Select
                  value={selectedCompetitionId}
                  onValueChange={setSelectedCompetitionId}
                >
                  <SelectTrigger
                    className="w-[250px] hover:cursor-pointer"
                    id="competition-select"
                  >
                    <SelectValue placeholder="Select a competition" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitions.map((competition) => (
                      <SelectItem key={competition.id} value={competition.id}>
                        {competition.name} {competition.isActive && "(Active)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="hover:cursor-pointer"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters() && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 py-0 text-xs"
                    >
                      {[
                        filters.beltColors.length > 0 ? 1 : 0,
                        filters.ageMin || filters.ageMax ? 1 : 0,
                        filters.type !== "all" ? 1 : 0,
                        filters.paymentStatus !== "all" ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="hover:cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Belt</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContestants.map((contestant) => (
                  <TableRow key={contestant.id}>
                    <TableCell>
                      {contestant.firstName} {contestant.lastName}
                    </TableCell>
                    <TableCell>{contestant.karateSchool}</TableCell>
                    <TableCell>{contestant.beltColor}</TableCell>
                    <TableCell>{contestant.age}</TableCell>
                    <TableCell>{contestant.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contestant.kata && (
                          <Badge variant="secondary">Kata</Badge>
                        )}
                        {contestant.kumite && (
                          <Badge variant="secondary">Kumite</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          contestant.paid ? "bg-green-700" : "bg-yellow-700"
                        }
                      >
                        {contestant.paid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredContestants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {hasActiveFilters()
                  ? "No contestants match the current filters."
                  : "No contestants registered for this competition yet."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Contestants</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="hover:cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Belt Color Filter */}
                <div>
                  <Label className="text-sm font-medium">Belt Colors</Label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {availableBeltColors.map((beltColor) => (
                      <div
                        key={beltColor}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`belt-${beltColor}`}
                          checked={filters.beltColors.includes(beltColor)}
                          onCheckedChange={(checked) =>
                            updateBeltColorFilter(beltColor, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`belt-${beltColor}`}
                          className="text-sm"
                        >
                          {beltColor}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Range Filter */}
                <div>
                  <Label className="text-sm font-medium">Age Range</Label>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Min age"
                        value={filters.ageMin}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            ageMin: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Max age"
                        value={filters.ageMax}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            ageMax: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        type: value as typeof prev.type,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="kata">Kata</SelectItem>
                      <SelectItem value="kumite">Kumite</SelectItem>
                      <SelectItem value="both">Both Kata & Kumite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <Select
                    value={filters.paymentStatus}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        paymentStatus: value as typeof prev.paymentStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1 hover:cursor-pointer"
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 hover:cursor-pointer"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
