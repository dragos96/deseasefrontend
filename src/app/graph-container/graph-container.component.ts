/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.3.0.4.
 ** Copyright (c) 2000-2021 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  NgZone,
  ViewChild,
  OnInit
} from '@angular/core'
import {
  IArrow,
  ICommand,
  IGraph,
  PolylineEdgeStyle,
  OrganicEdgeRouter,
  Size,
  TreeLayout,
  TreeReductionStage,
  INode
} from 'yfiles'
import { GraphComponentComponent } from './../graph-component/graph-component.component'
import { EDGE_DATA } from './../data'
import 'yfiles/view-layout-bridge.js'
import { Person } from './../model/Person'
import { NodeComponentStyle } from './../NodeComponentStyle'
import { PersonsService } from '../persons.service';
import { SecurityService } from '../security.service';

const NODE_DATA_OLD = [

  {
    id: 1,
    firstName: "Jameson",
    lastName: "James",
    name: "Jameson James"
  },
  {
    id: 2,
    firstName: "Svenson",
    lastName: "Sven",
    name: "Svenson Sven"
  }
]

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.css']
})
export class GraphContainerComponent implements AfterViewInit, OnInit {
  title = 'app'

  @ViewChild(GraphComponentComponent)
  private gcComponent!: GraphComponentComponent

  public currentPerson?: Person
  NODE_DATA: Person[] = [];

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private _injector: Injector,
    private _resolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _zone: NgZone,
    private personService: PersonsService,
    private securityService: SecurityService
  ) { }

  ngOnInit() {
    // TODO: find by family id
    console.log('STEP NG ON INIT')

  }

  ngAfterViewInit() {
    console.log('STEP AFTER VIEW INIT')
    // run outside Angular so the change detection won't slow down yFiles

    this.personService.findAll()
      .subscribe(rez => {
        console.log('persons: ', rez);
        this.NODE_DATA = rez;



        this._zone.runOutsideAngular(() => {
          const graphComponent = this.gcComponent.graphComponent
          const graph = graphComponent.graph

          graph.nodeDefaults.size = new Size(285, 100)
          graph.nodeDefaults.style = new NodeComponentStyle(
            this._injector,
            this._resolver,
            this._appRef,
            this._zone
          )

          graph.edgeDefaults.style = new PolylineEdgeStyle({
            stroke: '2px rgb(170, 170, 170)',
            targetArrow: IArrow.NONE
          })

          graphComponent.addCurrentItemChangedListener(() => {
            this.currentPerson = graphComponent.currentItem!.tag
          })

          this.createSampleGraph(graph)

          runLayout(graph)

          graphComponent.fitGraphBounds()
        })
      },
        err => {
          console.log('err loading persons: ', err);
        })


  }

  zoomIn() {
    this._zone.runOutsideAngular(() => {
      ICommand.INCREASE_ZOOM.execute(null, this.gcComponent.graphComponent)
    })
  }

  zoomOriginal() {
    this._zone.runOutsideAngular(() => {
      ICommand.ZOOM.execute(1, this.gcComponent.graphComponent)
    })
  }

  zoomOut() {
    this._zone.runOutsideAngular(() => {
      ICommand.DECREASE_ZOOM.execute(null, this.gcComponent.graphComponent)
    })
  }

  fitContent() {
    this._zone.runOutsideAngular(() => {
      ICommand.FIT_GRAPH_BOUNDS.execute(null, this.gcComponent.graphComponent)
    })
  }
  createSampleGraph(graph: IGraph): void {
    console.log('TEST NODE DATA NEW: ', this.NODE_DATA);
    const nodeMap: { [id: number]: INode } = {}

    this.NODE_DATA.forEach(nodeData => {
      console.log("ND: ", nodeData);
      nodeMap[nodeData.id] = graph.createNode({
        tag: new Person(nodeData)
      })
    })

    EDGE_DATA.forEach(({ from, to }) => {
      console.log('from: ', from);
      console.log('to: ', to);
      const fromNode = nodeMap[from]
      const toNode = nodeMap[to]
      if (fromNode && toNode) {
        graph.createEdge(fromNode, toNode)
      }
    })
  }
}



function runLayout(graph: IGraph): void {
  const treeLayout = new TreeLayout()
  const treeReductionStage = new TreeReductionStage()
  treeReductionStage.nonTreeEdgeRouter = new OrganicEdgeRouter()
  treeReductionStage.nonTreeEdgeSelectionKey = OrganicEdgeRouter.AFFECTED_EDGES_DP_KEY

  treeLayout.appendStage(treeReductionStage)

  graph.applyLayout(treeLayout)
}