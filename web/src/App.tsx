import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Pipeline } from "./pages/Pipeline";
import { PlantsHub } from "./pages/PlantsHub";
import { RfqDetail } from "./pages/RfqDetail";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Advisor } from "./pages/Advisor";
import { ChangePassword } from "./pages/ChangePassword";
import { CaseView } from "./pages/CaseView";
import { Materials } from "./pages/catalog/Materials";
import { ProblemTags } from "./pages/catalog/ProblemTags";
import { Teams } from "./pages/catalog/Teams";
import { Inserts } from "./pages/catalog/Inserts";
import { TestReports } from "./pages/catalog/TestReports";
import { Tools } from "./pages/catalog/Tools";
import { CuttingConditions } from "./pages/catalog/CuttingConditions";
import { Shapes } from "./pages/catalog/Shapes";
import { Chipbreakers } from "./pages/catalog/Chipbreakers";
import { CodeKeys } from "./pages/catalog/CodeKeys";
import { GradesHub } from "./pages/catalog/Grades";
import { Applications } from "./pages/catalog/Applications";
import { Substrates } from "./pages/catalog/Substrates";
import { Coatings } from "./pages/catalog/Coatings";
import { Imc } from "./pages/Imc";
import { Innovations } from "./pages/Innovations";
import { Solutions } from "./pages/Solutions";
import { SolutionView } from "./pages/SolutionView";
import { Branches } from "./pages/Branches";
import { BranchDetail } from "./pages/BranchDetail";
import { Npas } from "./pages/catalog/Npas";
import { NpaKnowledge } from "./pages/catalog/NpaKnowledge";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Full-screen pages outside the app layout (no sidebar) */}
      <Route
        path="/cases/:id"
        element={
          <RequireAuth>
            <CaseView />
          </RequireAuth>
        }
      />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Pipeline />} />
        <Route path="/plants" element={<PlantsHub />} />
        <Route path="/plants/:slug" element={<PlantsHub />} />
        {/* Old per-company addresses */}
        <Route path="/dauch-plants" element={<Navigate to="/plants/dauch" replace />} />
        <Route path="/gkn-aero-plants" element={<Navigate to="/plants/gkn-aero" replace />} />
        <Route path="/rfqs/:id" element={<RfqDetail />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/catalog/materials" element={<Materials />} />
        <Route path="/catalog/problem-tags" element={<ProblemTags />} />
        <Route path="/catalog/teams" element={<Teams />} />
        <Route path="/catalog/inserts" element={<Inserts />} />
        <Route path="/catalog/test-reports" element={<TestReports />} />
        <Route path="/catalog/tools" element={<Tools />} />
        <Route path="/catalog/cutting-conditions" element={<CuttingConditions />} />
        <Route path="/catalog/shapes" element={<Shapes />} />
        <Route path="/catalog/chipbreakers" element={<Chipbreakers />} />
        <Route path="/catalog/code-keys" element={<CodeKeys />} />
        <Route path="/catalog/grades" element={<GradesHub />} />
        <Route path="/catalog/grades/:slug" element={<GradesHub />} />
        {/* Old per-family addresses */}
        <Route path="/catalog/grades-cbn" element={<Navigate to="/catalog/grades/cbn" replace />} />
        <Route path="/catalog/grades-ceramic" element={<Navigate to="/catalog/grades/ceramic" replace />} />
        <Route path="/catalog/grades-pcd" element={<Navigate to="/catalog/grades/pcd" replace />} />
        <Route path="/catalog/applications" element={<Applications />} />
        <Route path="/catalog/substrates" element={<Substrates />} />
        <Route path="/catalog/coatings" element={<Coatings />} />
        <Route path="/imc" element={<Imc />} />
        <Route path="/innovations" element={<Innovations />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/solutions/brand/:id" element={<SolutionView />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/branches/:id" element={<BranchDetail />} />
        <Route path="/catalog/npas" element={<Npas />} />
        <Route path="/catalog/npa-knowledge" element={<NpaKnowledge />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
