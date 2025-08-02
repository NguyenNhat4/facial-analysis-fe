import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import FacialAnalysisPage from "@/pages/facial-analysis";
import XrayAnalysisPage from "@/pages/xray-analysis";
import Model3DPage from "@/pages/model-3d";
import DemoPage from "@/pages/demo";
import NotFound from "@/pages/not-found";
import ThreeDViewer from "./components/3DViewer";
import Treatment from "./TreatmentPlan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/demo" component={DemoPage} />
      <Route path="/chat" component={Chat} />
      <Route path="/facial-analysis" component={FacialAnalysisPage} />
      <Route path="/xray-analysis" component={XrayAnalysisPage} />
      <Route path="/model-3d" component={ThreeDViewer} />
      <Route path="/treatment-plan" component={Treatment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
