import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Pipeline } from "./pages/Pipeline";
import { RfqDetail } from "./pages/RfqDetail";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Advisor } from "./pages/Advisor";
import { ChangePassword } from "./pages/ChangePassword";
import { Materials } from "./pages/catalog/Materials";
import { ProblemTags } from "./pages/catalog/ProblemTags";
import { Teams } from "./pages/catalog/Teams";
import { Inserts } from "./pages/catalog/Inserts";
import { CuttingConditions } from "./pages/catalog/CuttingConditions";
import { Shapes } from "./pages/catalog/Shapes";
import { Chipbreakers } from "./pages/catalog/Chipbreakers";
import { Grades } from "./pages/catalog/Grades";
import { Coatings } from "./pages/catalog/Coatings";

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
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Pipeline />} />
        <Route path="/rfqs/:id" element={<RfqDetail />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/catalog/materials" element={<Materials />} />
        <Route path="/catalog/problem-tags" element={<ProblemTags />} />
        <Route path="/catalog/teams" element={<Teams />} />
        <Route path="/catalog/inserts" element={<Inserts />} />
        <Route path="/catalog/cutting-conditions" element={<CuttingConditions />} />
        <Route path="/catalog/shapes" element={<Shapes />} />
        <Route path="/catalog/chipbreakers" element={<Chipbreakers />} />
        <Route path="/catalog/grades" element={<Grades />} />
        <Route path="/catalog/coatings" element={<Coatings />} />
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
