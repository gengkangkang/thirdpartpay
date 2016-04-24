/*
 Highcharts JS v4.2.4 (2016-04-14)

 (c) 2014 Highsoft AS
 Authors: Jon Arild Nygard / Oystein Moseng

 License: www.highcharts.com/license
 */
(function (f) {
    typeof module === "object" && module.exports ? module.exports = f : f(Highcharts)
})(function (f) {
    var j = f.seriesTypes, B = f.map, n = f.merge, t = f.extend, u = f.extendClass, v = f.getOptions().plotOptions, w = function () {
    }, k = f.each, s = f.grep, i = f.pick, q = f.Series, C = f.stableSort, x = f.Color, D = function (a, b, c) {
        var d, c = c || this;
        for (d in a)a.hasOwnProperty(d) && b.call(c, a[d], d, a)
    }, y = function (a, b, c, d) {
        d = d || this;
        a = a || [];
        k(a, function (e, g) {
            c = b.call(d, c, e, g, a)
        });
        return c
    }, r = function (a, b, c) {
        c = c || this;
        a = b.call(c, a);
        a !== !1 && r(a, b,
            c)
    };
    v.treemap = n(v.scatter, {
        showInLegend: !1,
        marker: !1,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        dataLabels: {
            enabled: !0, defer: !1, verticalAlign: "middle", formatter: function () {
                return this.point.name || this.point.id
            }, inside: !0
        },
        tooltip: {headerFormat: "", pointFormat: "<b>{point.name}</b>: {point.node.val}</b><br/>"},
        layoutAlgorithm: "sliceAndDice",
        layoutStartingDirection: "vertical",
        alternateStartingDirection: !1,
        levelIsConstant: !0,
        opacity: 0.15,
        states: {
            hover: {
                borderColor: "#A0A0A0", brightness: j.heatmap ? 0 : 0.1, opacity: 0.75,
                shadow: !1
            }
        },
        drillUpButton: {position: {align: "right", x: -10, y: 10}}
    });
    j.treemap = u(j.scatter, n({
        pointAttrToOptions: {},
        pointArrayMap: ["value"],
        axisTypes: j.heatmap ? ["xAxis", "yAxis", "colorAxis"] : ["xAxis", "yAxis"],
        optionalAxis: "colorAxis",
        getSymbol: w,
        parallelArrays: ["x", "y", "value", "colorValue"],
        colorKey: "colorValue",
        translateColors: j.heatmap && j.heatmap.prototype.translateColors
    }, {
        type: "treemap",
        trackerGroups: ["group", "dataLabelsGroup"],
        pointClass: u(f.Point, {setVisible: j.pie.prototype.pointClass.prototype.setVisible}),
        getListOfParents: function (a, b) {
            var c = y(a, function (a, c, b) {
                c = i(c.parent, "");
                a[c] === void 0 && (a[c] = []);
                a[c].push(b);
                return a
            }, {});
            D(c, function (a, c, g) {
                c !== "" && f.inArray(c, b) === -1 && (k(a, function (a) {
                    g[""].push(a)
                }), delete g[c])
            });
            return c
        },
        getTree: function () {
            var a, b = this;
            a = B(this.data, function (a) {
                return a.id
            });
            a = b.getListOfParents(this.data, a);
            b.nodeMap = [];
            a = b.buildNode("", -1, 0, a, null);
            r(this.nodeMap[this.rootNode], function (a) {
                var d = !1, e = a.parent;
                a.visible = !0;
                if (e || e === "")d = b.nodeMap[e];
                return d
            });
            r(this.nodeMap[this.rootNode].children,
                function (a) {
                    var b = !1;
                    k(a, function (a) {
                        a.visible = !0;
                        a.children.length && (b = (b || []).concat(a.children))
                    });
                    return b
                });
            this.setTreeValues(a);
            return a
        },
        init: function (a, b) {
            q.prototype.init.call(this, a, b);
            this.options.allowDrillToNode && this.drillTo()
        },
        buildNode: function (a, b, c, d, e) {
            var g = this, h = [], z = g.points[b], A;
            k(d[a] || [], function (b) {
                A = g.buildNode(g.points[b].id, b, c + 1, d, a);
                h.push(A)
            });
            b = {id: a, i: b, children: h, level: c, parent: e, visible: !1};
            g.nodeMap[b.id] = b;
            if (z)z.node = b;
            return b
        },
        setTreeValues: function (a) {
            var b =
                this, c = b.options, d = 0, e = [], g, h = b.points[a.i];
            k(a.children, function (a) {
                a = b.setTreeValues(a);
                e.push(a);
                a.ignore ? r(a.children, function (a) {
                    var c = !1;
                    k(a, function (a) {
                        t(a, {ignore: !0, isLeaf: !1, visible: !1});
                        a.children.length && (c = (c || []).concat(a.children))
                    });
                    return c
                }) : d += a.val
            });
            C(e, function (a, c) {
                return a.sortIndex - c.sortIndex
            });
            g = i(h && h.value, d);
            t(a, {
                children: e,
                childrenTotal: d,
                ignore: !(i(h && h.visible, !0) && g > 0),
                isLeaf: a.visible && !d,
                levelDynamic: c.levelIsConstant ? a.level : a.level - b.nodeMap[b.rootNode].level,
                name: i(h && h.name, ""),
                sortIndex: i(h && h.sortIndex, -g),
                val: g
            });
            return a
        },
        calculateChildrenAreas: function (a, b) {
            var c = this, d = c.options, e = this.levelMap[a.levelDynamic + 1], g = i(c[e && e.layoutAlgorithm] && e.layoutAlgorithm, d.layoutAlgorithm), h = d.alternateStartingDirection, f = [], d = s(a.children, function (a) {
                return !a.ignore
            });
            if (e && e.layoutStartingDirection)b.direction = e.layoutStartingDirection === "vertical" ? 0 : 1;
            f = c[g](b, d);
            k(d, function (a, d) {
                var e = f[d];
                a.values = n(e, {val: a.childrenTotal, direction: h ? 1 - b.direction : b.direction});
                a.pointValues = n(e, {x: e.x / c.axisRatio, width: e.width / c.axisRatio});
                a.children.length && c.calculateChildrenAreas(a, a.values)
            })
        },
        setPointValues: function () {
            var a = this.xAxis, b = this.yAxis;
            k(this.points, function (c) {
                var d = c.node, e = d.pointValues, g, h;
                e && d.visible ? (d = Math.round(a.translate(e.x, 0, 0, 0, 1)), g = Math.round(a.translate(e.x + e.width, 0, 0, 0, 1)), h = Math.round(b.translate(e.y, 0, 0, 0, 1)), e = Math.round(b.translate(e.y + e.height, 0, 0, 0, 1)), c.shapeType = "rect", c.shapeArgs = {
                    x: Math.min(d, g), y: Math.min(h, e), width: Math.abs(g -
                        d), height: Math.abs(e - h)
                }, c.plotX = c.shapeArgs.x + c.shapeArgs.width / 2, c.plotY = c.shapeArgs.y + c.shapeArgs.height / 2) : (delete c.plotX, delete c.plotY)
            })
        },
        setColorRecursive: function (a, b) {
            var c = this, d, e;
            if (a) {
                d = c.points[a.i];
                e = c.levelMap[a.levelDynamic];
                b = i(d && d.options.color, e && e.color, b);
                if (d)d.color = b;
                a.children.length && k(a.children, function (a) {
                    c.setColorRecursive(a, b)
                })
            }
        },
        algorithmGroup: function (a, b, c, d) {
            this.height = a;
            this.width = b;
            this.plot = d;
            this.startDirection = this.direction = c;
            this.lH = this.nH = this.lW =
                this.nW = this.total = 0;
            this.elArr = [];
            this.lP = {
                total: 0, lH: 0, nH: 0, lW: 0, nW: 0, nR: 0, lR: 0, aspectRatio: function (a, c) {
                    return Math.max(a / c, c / a)
                }
            };
            this.addElement = function (a) {
                this.lP.total = this.elArr[this.elArr.length - 1];
                this.total += a;
                this.direction === 0 ? (this.lW = this.nW, this.lP.lH = this.lP.total / this.lW, this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH), this.nW = this.total / this.height, this.lP.nH = this.lP.total / this.nW, this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH)) : (this.lH = this.nH, this.lP.lW = this.lP.total /
                    this.lH, this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH), this.nH = this.total / this.width, this.lP.nW = this.lP.total / this.nH, this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH));
                this.elArr.push(a)
            };
            this.reset = function () {
                this.lW = this.nW = 0;
                this.elArr = [];
                this.total = 0
            }
        },
        algorithmCalcPoints: function (a, b, c, d) {
            var e, g, h, f, i = c.lW, m = c.lH, l = c.plot, j, o = 0, p = c.elArr.length - 1;
            b ? (i = c.nW, m = c.nH) : j = c.elArr[c.elArr.length - 1];
            k(c.elArr, function (a) {
                if (b || o < p)c.direction === 0 ? (e = l.x, g = l.y, h = i, f = a / h) : (e = l.x, g = l.y, f = m, h = a / f),
                    d.push({x: e, y: g, width: h, height: f}), c.direction === 0 ? l.y += f : l.x += h;
                o += 1
            });
            c.reset();
            c.direction === 0 ? c.width -= i : c.height -= m;
            l.y = l.parent.y + (l.parent.height - c.height);
            l.x = l.parent.x + (l.parent.width - c.width);
            if (a)c.direction = 1 - c.direction;
            b || c.addElement(j)
        },
        algorithmLowAspectRatio: function (a, b, c) {
            var d = [], e = this, g, f = {
                x: b.x,
                y: b.y,
                parent: b
            }, i = 0, j = c.length - 1, m = new this.algorithmGroup(b.height, b.width, b.direction, f);
            k(c, function (c) {
                g = b.width * b.height * (c.val / b.val);
                m.addElement(g);
                m.lP.nR > m.lP.lR && e.algorithmCalcPoints(a,
                    !1, m, d, f);
                i === j && e.algorithmCalcPoints(a, !0, m, d, f);
                i += 1
            });
            return d
        },
        algorithmFill: function (a, b, c) {
            var d = [], e, f = b.direction, h = b.x, i = b.y, j = b.width, m = b.height, l, n, o, p;
            k(c, function (c) {
                e = b.width * b.height * (c.val / b.val);
                l = h;
                n = i;
                f === 0 ? (p = m, o = e / p, j -= o, h += o) : (o = j, p = e / o, m -= p, i += p);
                d.push({x: l, y: n, width: o, height: p});
                a && (f = 1 - f)
            });
            return d
        },
        strip: function (a, b) {
            return this.algorithmLowAspectRatio(!1, a, b)
        },
        squarified: function (a, b) {
            return this.algorithmLowAspectRatio(!0, a, b)
        },
        sliceAndDice: function (a, b) {
            return this.algorithmFill(!0,
                a, b)
        },
        stripes: function (a, b) {
            return this.algorithmFill(!1, a, b)
        },
        translate: function () {
            var a, b;
            q.prototype.translate.call(this);
            this.rootNode = i(this.options.rootId, "");
            this.levelMap = y(this.options.levels, function (a, b) {
                a[b.level] = b;
                return a
            }, {});
            b = this.tree = this.getTree();
            this.axisRatio = this.xAxis.len / this.yAxis.len;
            this.nodeMap[""].pointValues = a = {x: 0, y: 0, width: 100, height: 100};
            this.nodeMap[""].values = a = n(a, {
                width: a.width * this.axisRatio,
                direction: this.options.layoutStartingDirection === "vertical" ? 0 : 1,
                val: b.val
            });
            this.calculateChildrenAreas(b, a);
            this.colorAxis ? this.translateColors() : this.options.colorByPoint || this.setColorRecursive(this.tree, void 0);
            if (this.options.allowDrillToNode)b = this.nodeMap[this.rootNode].pointValues, this.xAxis.setExtremes(b.x, b.x + b.width, !1), this.yAxis.setExtremes(b.y, b.y + b.height, !1), this.xAxis.setScale(), this.yAxis.setScale();
            this.setPointValues()
        },
        drawDataLabels: function () {
            var a = this, b = s(a.points, function (a) {
                return a.node.visible
            }), c, d;
            k(b, function (b) {
                d = a.levelMap[b.node.levelDynamic];
                c = {style: {}};
                if (!b.node.isLeaf)c.enabled = !1;
                if (d && d.dataLabels)c = n(c, d.dataLabels), a._hasPointLabels = !0;
                if (b.shapeArgs)c.style.width = b.shapeArgs.width, b.dataLabel && b.dataLabel.css({width: b.shapeArgs.width + "px"});
                b.dlOptions = n(c, b.options.dataLabels)
            });
            q.prototype.drawDataLabels.call(this)
        },
        alignDataLabel: j.column.prototype.alignDataLabel,
        pointAttribs: function (a, b) {
            var c = this.levelMap[a.node.levelDynamic] || {}, d = this.options, e = b && d.states[b] || {}, c = {
                stroke: a.borderColor || c.borderColor || e.borderColor ||
                d.borderColor,
                "stroke-width": i(a.borderWidth, c.borderWidth, e.borderWidth, d.borderWidth),
                dashstyle: a.borderDashStyle || c.borderDashStyle || e.borderDashStyle || d.borderDashStyle,
                fill: a.color || this.color,
                zIndex: b === "hover" ? 1 : 0
            };
            if (a.node.level <= this.nodeMap[this.rootNode].level)c.fill = "none", c["stroke-width"] = 0; else if (a.node.isLeaf) {
                if (b)c.fill = x(c.fill).brighten(e.brightness).get()
            } else i(d.interactByLeaf, !d.allowDrillToNode) ? c.fill = "none" : (d = i(e.opacity, d.opacity), c.fill = x(c.fill).setOpacity(d).get());
            return c
        },
        drawPoints: function () {
            var a = this, b = s(a.points, function (a) {
                return a.node.visible
            });
            k(b, function (c) {
                var b = "levelGroup-" + c.node.levelDynamic;
                a[b] || (a[b] = a.chart.renderer.g(b).attr({zIndex: 1E3 - c.node.levelDynamic}).add(a.group));
                c.group = a[b];
                c.pointAttr = {"": a.pointAttribs(c), hover: a.pointAttribs(c, "hover"), select: {}}
            });
            j.column.prototype.drawPoints.call(this);
            a.options.allowDrillToNode && k(b, function (b) {
                var d;
                if (b.graphic)d = b.drillId = a.options.interactByLeaf ? a.drillToByLeaf(b) : a.drillToByGroup(b),
                    b.graphic.css({cursor: d ? "pointer" : "default"})
            })
        },
        drillTo: function () {
            var a = this;
            f.addEvent(a, "click", function (b) {
                var b = b.point, c = b.drillId, d;
                c && (d = a.nodeMap[a.rootNode].name || a.rootNode, b.setState(""), a.drillToNode(c), a.showDrillUpButton(d))
            })
        },
        drillToByGroup: function (a) {
            var b = !1;
            if (a.node.level - this.nodeMap[this.rootNode].level === 1 && !a.node.isLeaf)b = a.id;
            return b
        },
        drillToByLeaf: function (a) {
            var b = !1;
            if (a.node.parent !== this.rootNode && a.node.isLeaf)for (a = a.node; !b;)if (a = this.nodeMap[a.parent], a.parent ===
                this.rootNode)b = a.id;
            return b
        },
        drillUp: function () {
            var a = null;
            this.rootNode && (a = this.nodeMap[this.rootNode], a = a.parent !== null ? this.nodeMap[a.parent] : this.nodeMap[""]);
            if (a !== null)this.drillToNode(a.id), a.id === "" ? this.drillUpButton = this.drillUpButton.destroy() : (a = this.nodeMap[a.parent], this.showDrillUpButton(a.name || a.id))
        },
        drillToNode: function (a) {
            this.options.rootId = a;
            this.isDirty = !0;
            this.chart.redraw()
        },
        showDrillUpButton: function (a) {
            var b = this, a = a || "< Back", c = b.options.drillUpButton, d, e;
            if (c.text)a =
                c.text;
            this.drillUpButton ? this.drillUpButton.attr({text: a}).align() : (e = (d = c.theme) && d.states, this.drillUpButton = this.chart.renderer.button(a, null, null, function () {
                b.drillUp()
            }, d, e && e.hover, e && e.select).attr({
                align: c.position.align,
                zIndex: 9
            }).add().align(c.position, !1, c.relativeTo || "plotBox"))
        },
        buildKDTree: w,
        drawLegendSymbol: f.LegendSymbolMixin.drawRectangle,
        getExtremes: function () {
            q.prototype.getExtremes.call(this, this.colorValueData);
            this.valueMin = this.dataMin;
            this.valueMax = this.dataMax;
            q.prototype.getExtremes.call(this)
        },
        getExtremesFromAll: !0,
        bindAxes: function () {
            var a = {
                endOnTick: !1,
                gridLineWidth: 0,
                lineWidth: 0,
                min: 0,
                dataMin: 0,
                minPadding: 0,
                max: 100,
                dataMax: 100,
                maxPadding: 0,
                startOnTick: !1,
                title: null,
                tickPositions: []
            };
            q.prototype.bindAxes.call(this);
            f.extend(this.yAxis.options, a);
            f.extend(this.xAxis.options, a)
        }
    }))
});
