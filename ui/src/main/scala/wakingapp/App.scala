package wakingapp

import org.widok._

object Routes {
  val calendar = Route("/", pages.Calendar)
  val notFound = Route("/404", pages.NotFound)

  val routes = Set(calendar, notFound)
}

object App extends RoutingApplication(Routes.routes, Routes.notFound)
