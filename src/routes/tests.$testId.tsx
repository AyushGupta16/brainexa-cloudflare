import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { tests } from "@/lib/mockData";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/tests/$testId")({
  component: TestPage,
});

function TestPage() {
  const { testId } = Route.useParams();
  const test = tests.find((t) => t.id === testId);
  if (!test) throw notFound();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = test.questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const total = test.questions.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/tests" className="hover:text-primary">Tests</Link> /{" "}
          <span className="text-foreground">{test.title}</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{test.title}</h1>

        {!submitted && (
          <div className="space-y-4">
            {test.questions.map((q, i) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Q{i + 1}. {q.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`border rounded-md p-3 cursor-pointer flex items-center gap-3 hover:bg-accent ${
                        answers[q.id] === idx ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === idx}
                        onChange={() => setAnswers({ ...answers, [q.id]: idx })}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            ))}
            <Button
              size="lg"
              className="w-full"
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length !== total}
            >
              Submit Test ({Object.keys(answers).length}/{total} answered)
            </Button>
          </div>
        )}

        {submitted && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">
                  {score} / {total}
                </div>
                <p className="text-muted-foreground mt-1">
                  {Math.round((score / total) * 100)}% — {score >= total * 0.6 ? "Passed 🎉" : "Keep practicing"}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => { setAnswers({}); setSubmitted(false); }}>Retake</Button>
                  <Button variant="outline" asChild>
                    <Link to="/tests">All tests</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            {test.questions.map((q, i) => {
              const correct = answers[q.id] === q.correctIndex;
              return (
                <Card key={q.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      {correct ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">Q{i + 1}. {q.text}</div>
                        <div className="text-sm mt-2">
                          Your answer:{" "}
                          <Badge variant={correct ? "default" : "destructive"}>
                            {q.options[answers[q.id]]}
                          </Badge>
                        </div>
                        {!correct && (
                          <div className="text-sm mt-1">
                            Correct: <Badge>{q.options[q.correctIndex]}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
