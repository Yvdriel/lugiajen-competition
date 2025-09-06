"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Competition {
  id: string
  name: string
  description: string | null
  isActive: boolean
  isOpen: boolean
  createdAt: string
}

interface Contestant {
  id: string
  firstName: string
  lastName: string
  karateSchool: string
  beltColor: string
  age: number
  email: string
  kata: boolean
  kumite: boolean
  paid: boolean
  competition: Competition
  createdAt: string
}

export function AdminDashboard() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [competitionsRes, contestantsRes] = await Promise.all([
        fetch("/api/competitions"),
        fetch("/api/contestants"),
      ])

      if (competitionsRes.ok) {
        const competitionsData = await competitionsRes.json()
        setCompetitions(competitionsData)
      }

      if (contestantsRes.ok) {
        const contestantsData = await contestantsRes.json()
        setContestants(contestantsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const createCompetition = async () => {
    try {
      const response = await fetch("/api/competitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompetition),
      })

      if (response.ok) {
        setNewCompetition({ name: "", description: "" })
        fetchData()
      }
    } catch (error) {
      console.error("Error creating competition:", error)
    }
  }

  const toggleCompetitionStatus = async (id: string, field: "isActive" | "isOpen") => {
    try {
      const response = await fetch(`/api/competitions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: !competitions.find(c => c.id === id)?.[field] }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error updating competition:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

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
                  onChange={(e) => setNewCompetition(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Spring Karate Tournament 2025"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCompetition.description}
                  onChange={(e) => setNewCompetition(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Annual karate competition"
                />
              </div>
              <Button onClick={createCompetition} className="w-full">
                Create Competition
              </Button>
            </CardContent>
          </Card>

          {/* Competition Management */}
          <Card>
            <CardHeader>
              <CardTitle>Competition Management</CardTitle>
              <CardDescription>
                Manage existing competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitions.map((competition) => (
                  <div key={competition.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{competition.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{competition.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={competition.isActive}
                            onCheckedChange={() => toggleCompetitionStatus(competition.id, "isActive")}
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={competition.isOpen}
                            onCheckedChange={() => toggleCompetitionStatus(competition.id, "isOpen")}
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
            <CardTitle>Registered Contestants</CardTitle>
            <CardDescription>
              View all registered contestants across all competitions
            </CardDescription>
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
                  <TableHead>Competition</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contestants.map((contestant) => (
                  <TableRow key={contestant.id}>
                    <TableCell>{contestant.firstName} {contestant.lastName}</TableCell>
                    <TableCell>{contestant.karateSchool}</TableCell>
                    <TableCell>{contestant.beltColor}</TableCell>
                    <TableCell>{contestant.age}</TableCell>
                    <TableCell>{contestant.email}</TableCell>
                    <TableCell>{contestant.competition.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contestant.kata && <Badge variant="secondary">Kata</Badge>}
                        {contestant.kumite && <Badge variant="secondary">Kumite</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={contestant.paid ? "default" : "destructive"}>
                        {contestant.paid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
