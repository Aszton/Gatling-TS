import {
  atOnceUsers,
  scenario,
  simulation,
  pause,
  rampUsers,
  jsonPath,
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export default simulation((setUp) => {
  const apiData = http
    .baseUrl("https://videogamedb.uk:443/api/v2")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

  const myScenario = scenario("my scenario").exec(
    http("Get all games").get("/videogame").check(status().is(200)),
    pause(5),
    http("Get single game")
      .get("/videogame/1")
      .check(status().is(200), jsonPath("$.name").is("Resident Evil 4"))
  );

  setUp(
    myScenario
      .injectOpen(atOnceUsers(5), rampUsers(10).during(10))
      .protocols(apiData)
  );
});
