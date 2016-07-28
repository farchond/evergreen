  /*
  ReactJS code for the Waterfall page. Grid calls the Variant class for each distro, and the Variant class renders each build variant for every version that exists. In each build variant we iterate through all the tasks and render them as well. The row of headers is just a placeholder at the moment.
  */

// Given a version id, build id, and server data, returns the build associated with it 
function getBuildByIds(versionId, buildId, data) {
  return data.versions[versionId].builds[buildId];
}

// Preprocess the data given by the server 
// Sort the array of builds for each version, as well as the array of build variants
function preProcessData(data) {
  // Comparison function used to sort the builds for each version
  function comp(a, b) {
      if (a.build_variant.display_name > b.build_variant.display_name) return 1;
      if (a.build_variant.display_name < b.build_variant.display_name) return -1;
      return 0;
    }

  // Iterate over each version and sort the list of builds for unrolled up versions 
  // Keep track of an index for an unrolled up version as well

  _.each(data.versions, function(version, i) {
    if (!version.rolled_up) {
      data.unrolledVersionIndex = i;
      data.versions[i].builds = version.builds.sort(comp);
    }
  });

  //Sort the build variants that Grid uses to show the build column on the left-hand side
  data.build_variants = data.build_variants.sort();
}

preProcessData(window.serverData);

// The Root class renders all components on the waterfall page, including the grid view and the filter and new page buttons
// The one exception is the header, which is written in Angular and managed by menu.html
class Root extends React.Component{
  render() {
    return (
      React.createElement("div", null, 
        React.createElement(Grid, {data: this.props.data})
      )
    )
  }
}

// The main class that binds to the root div. This contains all the distros, builds, and tasks
class Grid extends React.Component{
  render() {
    var data = this.props.data;
    return (
      React.createElement("div", {className: "waterfall-grid "}, 
        
          this.props.data.build_variants.map((x, i) => {
            return React.createElement(Variant, {key: x, data: data, variantIndex: i, variantDisplayName: x});
          })
        
      ) 
    )
  }
}

// The class for each "row" of the waterfall page. Includes the build variant link, as well as the five columns
// of versions.
class Variant extends React.Component{
  render() {
    var data = this.props.data;
    var variantIndex = this.props.variantIndex;
    var variantId = getBuildByIds(data.unrolledVersionIndex, variantIndex, data).build_variant.id;
    
    return (
      React.createElement("div", {className: "row variant-row"}, 

        /* column of build names */
        React.createElement("div", {className: "col-xs-2 build-variant-name distro-col"}, 
          React.createElement("a", {href: "/build_variant/" + project + "/" + variantId}, 
            this.props.variantDisplayName
          )
        ), 

        /* 5 columns of versions */
        React.createElement("div", {className: "col-xs-10"}, 
          React.createElement("div", {className: "row build-cols"}, 
            
              data.versions.map((x,i) => {
                return React.createElement(Build, {key: x.ids[0], data: data, variantIndex: variantIndex, versionIndex: i});
              })
            
          )
        )

      )
    )
  }
}

// Each Build class is one group of tasks for an version + build variant intersection
// We case on whether or not a build is active or not, and return either an ActiveBuild or InactiveBuild respectively
class Build extends React.Component{
  render() {
    var currentVersion = this.props.data.versions[this.props.versionIndex];
    
    if (currentVersion.rolled_up) {
      return React.createElement(InactiveBuild, null);
    }
   
    var isCollapsed = true; // Will add switch to change isCollapsed state 
    
    if (isCollapsed) {
      var tasksToShow = ['failed','sytem-failed']; // Can be modified to show combinations of tasks by statuses
      return (
        React.createElement("div", {className: "build"}, 
          React.createElement(ActiveBuild, {filters: tasksToShow, data: this.props.data, versionIndex: this.props.versionIndex, variantIndex: this.props.variantIndex}), 
          
          React.createElement(CollapsedBuild, {data: this.props.data, versionIndex: this.props.versionIndex, variantIndex: this.props.variantIndex})
        )
      )
    } 
    
    //We have an active, uncollapsed build 
    return (
      React.createElement("div", {className: "build"}, 
        React.createElement(ActiveBuild, {data: this.props.data, versionIndex: this.props.versionIndex, variantIndex: this.props.variantIndex})
      )
    )
  }
}

// At least one task in the version is non-inactive, so we display all build tasks with their appropiate colors signifying their status
class ActiveBuild extends React.Component {
  render() {
    var tasks = getBuildByIds(this.props.versionIndex, this.props.variantIndex, this.props.data).tasks;
    var validTasks = this.props.filters;

    // If our filter is defined, we filter our list of tasks to only display certain types
    // Currently we only filter on status, but it would be easy to filter on other task attributes
    if (validTasks != null) {
      tasks = _.filter(tasks, ((x) => { i
        for (var i = 0; i < validTasks.length; i++) {
          if (validTasks[i] === x.status) return true;
        }
        return false;
      }));
    }

    return (
      React.createElement("div", {className: "active-build"}, 
        
          tasks.map((x) => {
            return React.createElement(Task, {key: x.id, task: x})
          })
        
      )
    )
  }
}

// All tasks are inactive, so we display the words "inactive build"
class InactiveBuild extends React.Component {
  render() {
    return React.createElement("div", {className: "inactive-build"}, " inactive build ");
  }
}

// A Task contains the information for a single task for a build, including the link to its page, and a tooltip
class Task extends React.Component {
  render() {
    var status = this.props.task.status;
    var tooltipContent = this.props.task.display_name + " - " + status;
    return (
      React.createElement("div", {"data-tooltip": tooltipContent, className: "waterfall-box"}, 
        React.createElement("a", {href: "/task/" + this.props.task.id, className: "task-result " + status})
      )
    )
  }
}

// A CollapsedBuild contains a set of PartialProgressBars, which in turn make up a full progress bar
// We iterate over the 5 different main types of task statuses, each of which have a different color association
class CollapsedBuild extends React.Component {
  render() {
    var build = getBuildByIds(this.props.versionIndex, this.props.variantIndex, this.props.data);
    var taskStats = build.waterfallTaskStatusCount;

    var taskTypes = [ 
                      ["success"      , taskStats.succeeded], 
                      ["dispatched"   , taskStats.started], 
                      ["system-failed", taskStats.timed_out],
                      ["undispatched" , taskStats.undispatched], 
                      ["inactive"     , taskStats.inactive]
                    ];

    // Remove all task summaries that have 0 tasks
    taskTypes = _.filter(taskTypes,((x => { 
      return x[1] > 0;
    })));

    return (
      React.createElement("div", {className: "collapsed-bar"}, 
        
          taskTypes.map((x) => {
            return React.createElement(TaskSummary, {key: x[0], total: build.tasks.length, status: x[0], taskNum: x[1]})
          }) 
        
      )
    )
  }
}

// A TaskSummary is the class for one rolled up task type
// A CollapsedBuild is comprised of an  array of contiguous TaskSummaries below individual failing tasks 
class TaskSummary extends React.Component {
  render() {
    var status = this.props.status;
    return (
      React.createElement("div", {className: status + " task-summary"}, 
        "+", this.props.taskNum
      )
    )
  }
}

